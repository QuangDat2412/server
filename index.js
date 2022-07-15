const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
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

app.use('/images', cors(corsOptions), express.static(path.join(__dirname, 'public/images')));
app.use(cors());

app.use(express.json());
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        let name = Common.makeCode(10) + '.' + file.originalname.split('.').reverse()[0];
        req.body.name = name;
        cb(null, name);
    },
});

const upload = multer({ storage: storage });
app.post('/api/upload/images', upload.single('file'), (req, res) => {
    try {
        return res.status(200).json('images/' + req.body.name[0]);
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
