var userRouter = require("express").Router();
const userInterface = require('./userInterface');
var bodyParser = require('body-parser')
const { body, param, validationResult } = require('express-validator');
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// GET (get all users): curl -X GET http://localhost:8081/users/
userRouter.get('/', function(req, res){
    res.send(userInterface.getAllUsers());
})

// POST (create user): curl -X POST -d 'username=onni&email=onni@gmail.com' http://localhost:8081/users
userRouter.post('/', urlencodedParser, body('email').isEmail(), body('username').notEmpty(), function(req, res) {
    var msg;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (userInterface.userExists(req.body.email)){
        msg = 'User with email ' + req.body.email + ' already exists';
    } else {
        const userId = userInterface.createUser(req.body.username, req.body.email)
        msg = 'User created with id: ' + userId;
    }
    res.send(msg);
})

// GET /id (get user with id): curl -X GET http://localhost:8081/users/USERID
userRouter.get('/:id', function (req, res) {
    var user = userInterface.findUserById(req.params.id)
    if (user == undefined){
        res.send('User not found');
    } else{
        res.send(user);
    }
})

// PUT /id (update task with id): curl -X PUT -d 'username=onni&email=onni@loadmill.com' http://localhost:8081/users/USERID
userRouter.put('/:id', urlencodedParser, body('email').isEmail(), body('username').notEmpty(), function (req, res) {
    var userUpdated = userInterface.updateUser(req.params.id, req.body.username, req.body.email)
    if (userUpdated){
        res.send('User updated');
    } else{
        res.send('User not found');
    }
})

// DELETE (delete task with id): curl -X DELETE http://localhost:8081/users/USERID
userRouter.delete('/:id', function (req, res) {
    var userDeleted = userInterface.deleteUser(req.params.id);
    if (userDeleted){
        res.send('User deleted');
    } else {
        res.send('User not found');
    }
})

module.exports = userRouter;