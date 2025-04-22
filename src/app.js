const express = require('express');
const cookieParser = require('cookie-parser');





const authRoutes              = require('./routes/authRouter');
const usersRoutes             = require('./routes/user.routes');
const taskRoutes              = require('./routes/taskRouter')


const app = express();
app.use(express.json());
app.use(cookieParser());



app.use('/api/auth',         authRoutes);
app.use('/api/users',        usersRoutes);
app.use('/api/task',         taskRoutes)




//export app
module.exports = app;