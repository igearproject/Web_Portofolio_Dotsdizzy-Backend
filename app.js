require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors=require('cors');

const connectDB=require('./config/dbConnection');

const indexRouter = require('./routes/index');
const emailRouter = require('./routes/email');
const messageRouter = require('./routes/message');
const categoryRouter = require('./routes/category');
const projectRouter = require('./routes/project');
const imageRouter = require('./routes/image');
const userRouter = require('./routes/user');

const app = express();

connectDB();
// cors configure
const whitelist = ['http://localhost:3000','http://127.0.0.1:3000']
const corsOptions = {
    origin:whitelist,
    credentials: true,
}
app.use(cors(corsOptions))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/email', emailRouter);
app.use('/message', messageRouter);
app.use('/category', categoryRouter);
app.use('/project', projectRouter);
app.use('/image', imageRouter);

module.exports = app;
