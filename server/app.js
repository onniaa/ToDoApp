var express = require('express');
var cors = require('cors')

var app = express();
app.use(cors())

const userRouter =  require('./userRouter');
const taskRouter =  require('./taskRouter');

app.use(function (req, res, next) {
    console.log("URL: %s, Method: %s", req.get('host'), req.method)
    next();
  })

app.use('/users', userRouter);
app.use('/tasks', taskRouter);

app.listen(8082)