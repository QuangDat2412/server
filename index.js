const express = require('express');
const { exec } = require('child_process');
const http = require('http');
var app = express();
const server = http.createServer(app);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const authRoute = require('./routes/auth');
const commentRoute = require('./routes/comment');
const userRoute = require('./routes/user');
const courseRoute = require('./routes/course');
const lcRoute = require('./routes/learningCourse');
const optionRoute = require('./routes/option');
const topicRoute = require('./routes/topic');
const lessonRoute = require('./routes/lesson');
const multer = require('multer');
const path = require('path');
const Common = require('./constants/common');

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DB Connection Successful!'))
    .catch((err) => console.log(err));
var corsOptions = {
    origin: '*',
};

app.use('/files', cors(corsOptions), express.static(path.join(__dirname, 'wwwroot/files')));
app.use(cors());

app.use(express.json());
const socketIo = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
});
let users = [];

const addUser = (userId, courseId, socketId) => {
    !users.some((user) => user.userId === userId && user.userId === courseId) && users.push({ userId, courseId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};
const getUsers = (courseId) => {
    return users.filter((user) => user.courseId === courseId);
};
socketIo.on('connection', (socket) => {
    console.log('New client connected' + socket.id);

    socket.on('addUser', (model) => {
        addUser(model.userId, model.courseId, socket.id);
    });
    socket.on('sendMessage', ({ courseId }) => {
        const users = getUsers(courseId);

        users.forEach((user) => {
            socketIo.to(user.socketId).emit('getMessage', {
                get: true,
            });
        });
    });
    socket.on('disconnect', () => {
        console.log('a user disconnected!');
        removeUser(socket.id);
    });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let type = file.mimetype.split('/')[0];
        let _name = Common.makeCode(10);
        req.body.name = _name;
        let folder = 'wwwroot/files/' + type;
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
        if (type == 'video') {
            folder = folder + '/' + _name;
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder);
            }
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        let name = req.body.name + '.' + file.originalname.split('.').reverse()[0];
        req.body.name = name;
        cb(null, name);
    },
});

const upload = multer({ storage: storage });
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (req.file) {
            let type = req.file.mimetype.split('/')[0];
            if (type == 'video') {
                let newName = req.body.name[0].split('.')[0];
                exec(
                    `ffmpeg -i ${
                        req.file.path
                    } -hls_time 2 -hls_playlist_type vod -hls_flags independent_segments -hls_segment_type mpegts -hls_segment_filename ${
                        req.file.destination + '/' + newName + '%08d.ts'
                    }  ${req.file.destination + '/' + newName + '.m3u8'}`,
                    function (error, stdout, stderr) {
                        fs.unlinkSync(req.file.path);
                    }
                );
                return res.status(200).json('files/video/' + newName + '/' + newName + '.m3u8');
            } else {
                return res.status(200).json('files/' + type + '/' + req.body.name[0]);
            }
        }
    } catch (error) {
        console.error(error);
    }
});
app.use('/api/learningCourse', lcRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/courses', courseRoute);
app.use('/api/topics', topicRoute);
app.use('/api/options', optionRoute);
app.use('/api/lessons', lessonRoute);
app.use('/api/comment', commentRoute);

server.listen(process.env.PORT || 2412, () => {
    console.log('Backend server is running!');
});
