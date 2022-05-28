const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const courseRoute = require('./routes/course');
const optionRoute = require('./routes/option');
const topicRoute = require('./routes/topic');
const lessonRoute = require('./routes/lesson');

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DB Connection Successful!'))
    .catch((err) => console.log(err));
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/courses', courseRoute);
app.use('/api/topics', topicRoute);
app.use('/api/options', optionRoute);
app.use('/api/lessons', lessonRoute);

app.listen(process.env.PORT || 2412, () => {
    console.log('Backend server is running!');
});
