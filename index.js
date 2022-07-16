const express = require('express');
const { exec } = require('child_process');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const authRoute = require('./routes/auth');
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
                let newName = req.body.name.split('.')[0];
                exec(
                    `ffmpeg -i ${
                        req.file.path
                    } -hls_time 2 -hls_playlist_type vod -hls_flags independent_segments -hls_segment_type mpegts -hls_segment_filename ${
                        req.file.destination + '/' + newName + '%03d.ts'
                    }  ${req.file.destination + '/' + newName + '.m3u8'}`
                );
                return res.status(200).json('files/video/' + newName + '/' + newName + '.m3u8');
            } else {
                return res.status(200).json('files/' + type + '/' + req.body.name);
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

app.listen(process.env.PORT || 2412, () => {
    console.log('Backend server is running!');
});
