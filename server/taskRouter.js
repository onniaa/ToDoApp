var taskRouter = require("express").Router();
const taskInterface = require('./taskInterface');
var bodyParser = require('body-parser');
const { findUserById } = require("./userInterface");
const { body, param, validationResult } = require('express-validator');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// GET (get all tasks): curl -X GET http://localhost:8081/tasks
taskRouter.get('/', function(req, res){
    res.send(taskInterface.getAllTasks());
})

// POST (create task): curl -X POST -d 'header=To Do App&description=Code one' http://localhost:8081/tasks
taskRouter.post('/', urlencodedParser, body('header').notEmpty(), function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const taskId = taskInterface.createTask(req.body.header, req.body.description)
    res.send('Task created with id: ' + taskId);
})

// GET /id (get task with id): curl -X GET http://localhost:8081/tasks/TASKIcD
taskRouter.get('/:id', function (req, res) {
    var task = taskInterface.findTaskById(req.params.id)
    if (task == undefined){
        res.send('Task not found');
    } else {
        res.send(task);
    }
})

// PUT /id (update task with id): curl -X PUT -d 'header=To Do App&description=New description' http://localhost:8081/tasks/TASKID
taskRouter.put('/:id', urlencodedParser, body('header').notEmpty(), function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    var taskUpdated = taskInterface.updateTask(req.params.id, req.body.header, req.body.description);
    if (taskUpdated){
        res.send('Task updated');
    } else {
        res.send('Task not found');
    }
})

// DELETE /id (delete task with id): curl -X DELETE http://localhost:8081/tasks/TASKID
taskRouter.delete('/:id', function (req, res) {
    var taskDeleted = taskInterface.deleteTask(req.params.id);
    if (taskDeleted){
        res.send('Task deleted');
    } else {
        res.send('Task not found');
    }
})

// PATCH /id (map task with id to user with userId): curl -X PATCH -d 'userId=USERID&detach=false' http://localhost:8081/tasks/TASKID
taskRouter.patch('/:id', urlencodedParser, body('userId').notEmpty(), body('detach').notEmpty(), function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    var msg;
    var task = taskInterface.findTaskById(req.params.id);
    var user = findUserById(req.body.userId);
    if (task == undefined){
        msg = 'Task not found';
    } else if (user == undefined){
        msg = 'User not found';
    } else {
        if (req.body.detach == "true"){
            taskInterface.detachTaskFromUser(req.body.userId, req.params.id);
            msg = 'Task detached';
        } else {
            res.send(taskInterface.attachTaskToUser(req.body.userId, req.params.id));
            return;
            // msg = 'Task attached';
        }
    }
    res.send(msg);
})

module.exports = taskRouter;