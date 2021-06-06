var userRouter = require("express").Router();
const userInterface = require('./userInterface');
var bodyParser = require('body-parser')
const { body, param, validationResult } = require('express-validator');
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// GET (get all users): curl -X GET http://localhost:8082/users/
userRouter.get('/', async function(req, res, next){
    try{
        res.send(await userInterface.getAllUsers());
    } catch (err){
        next(err);
    }
})

// POST (create user): curl -X POST -d 'username=onni&email=onni@gmail.com' http://localhost:8082/users
userRouter.post('/', urlencodedParser, body('email').isEmail(), body('username').notEmpty(), async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try{
        if (await userInterface.emailInUse(req.body.email))
            res.send(`User with email ${req.body.email} already exists`);
        else {
            const userId = await userInterface.createUser(req.body.username, req.body.email);
            res.send(`User created with id ${userId}`);
        }
    } catch (err){
        next(err);
    }
});

// GET /id (get user with id): curl -X GET http://localhost:8082/users/USERID
userRouter.get('/:id', async function (req, res, next) {
    try{
        res.send(await userInterface.findUserById(req.params.id));
    } catch (err){
        next(err);
    }
});

// PUT /id (update task with id): curl -X PUT -d 'username=onni&email=onni@loadmill.com' http://localhost:8082/users/USERID
userRouter.put('/:id', urlencodedParser, body('email').isEmail(), body('username').notEmpty(), async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    msg = `User with id ${req.params.id} `;
    try{
        const user = await userInterface.updateUser(req.params.id, req.body);
        if (user)
            msg += `updated`;
        else
            msg += `not found`;
        res.send(msg);    
    } catch (err) {
        next(err);
    }
});

// delete all user mapping as result?
// DELETE (delete task with id): curl -X DELETE http://localhost:8082/users/USERID
userRouter.delete('/:id', async function (req, res, next) {
    msg = `User with id ${req.params.id} `;
    try{
        const user = await userInterface.findUserById(req.params.id);
        if (user.length){
            await userInterface.deleteUser(req.params.id);
            msg += `deleted`;
        } else {
            msg += `doesn't exists`;
        }
        res.send(msg);
    } catch (err){
        next(err);
    }
});

module.exports = userRouter;