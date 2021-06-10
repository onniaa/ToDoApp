var taskRouter = require("express").Router();
const taskInterface = require('./taskInterface');
var bodyParser = require('body-parser');
const { findUserById } = require("./userInterface");
const { body, param, validationResult } = require('express-validator');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// GET (get all tasks): curl -X GET http://localhost:8082/tasks
taskRouter.get('/', async function(req, res, next){
    try{
        res.send(await taskInterface.getAllTasks());
    } catch (err){
        next(err);
    }
});

// POST (create task): curl -X POST -d 'header=To Do App&description=Code one' http://localhost:8082/tasks
taskRouter.post('/', jsonParser, body('header').notEmpty(), async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try{
        const taskId = await taskInterface.createTask(req.body.header, req.body.description);
        res.send(taskId);
    } catch (err){
        next(err);
    }
});

// GET /id (get task with id): curl -X GET http://localhost:8082/tasks/TASKID
taskRouter.get('/:id', async function (req, res, next) {
    try{
        res.send(await taskInterface.findTaskById(req.params.id));
    } catch (err){
        next(err);
    }
});

// PUT /id (update task with id): curl -X PUT -d 'header=To Do App&description=New description' http://localhost:8082/tasks/TASKID
taskRouter.put('/:id', jsonParser, body('header').notEmpty(), async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    msg = `Task with id ${req.params.id} `;
    try{
        const task = await taskInterface.updateTask(req.params.id, req.body);
        if (task)
            msg += `updated`;
        else
            msg += `not found`;
        res.send(msg);    
    } catch (err) {
        next(err);
    }
});

// delete all task mapping as result?
// DELETE /id (delete task with id): curl -X DELETE http://localhost:8082/tasks/TASKID
taskRouter.delete('/:id', async function (req, res, next) {
    msg = `Task with id ${req.params.id} `;
    try{
        const task = await taskInterface.findTaskById(req.params.id);
        if (task.length){
            await taskInterface.deleteTask(req.params.id);
            msg += `deleted`;
        } else {
            msg += `doesn't exists`;
        }
        res.send(msg);
    } catch (err){
        next(err);
    }
});

// PATCH /id (map task with id to user with userId): curl -X PATCH -d 'userId=USERID&detach=false' http://localhost:8082/tasks/TASKID
taskRouter.patch('/:id', jsonParser, body('userId').notEmpty(), body('detach').notEmpty(), async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try{
        const task = await taskInterface.findTaskById(req.params.id);
        const user = await findUserById(req.body.userId);
        if (!task.length)
            res.send(`task with id ${req.params.id} not found`);
        else if (!user.length)
            res.send(`user with id ${req.body.userId} not found`);
        else{
            if (req.body.detach == "true"){
                if (await taskInterface.detachTaskFromUser(req.body.userId, req.params.id))
                    res.send(`mapping detached`);
                else
                    res.send(`no mapping found`);
            } else {
                if (await taskInterface.mappingExists(req.body.userId, req.params.id))
                    res.send(`mapping exists`);
                else {
                    res.send(await taskInterface.attachTaskToUser(req.body.userId, req.params.id));
                }
            }
        }    
    } catch (err){
        next(err);
    }
});

module.exports = taskRouter;