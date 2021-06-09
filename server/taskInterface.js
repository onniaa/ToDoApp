const { v4: uuidv4 } = require('uuid');
const db = require('../db/db');
const tasksTable = 'tasks'
const tasksToUsersTable = 'task_user_map'

async function findTaskById(id){
    return await db(tasksTable)
                .where({id});
}

async function deleteTask(id){
    await db(tasksTable)
        .where({id})
        .del();

    await deleteTaskToUserMappings(id);
}

async function deleteTaskToUserMappings(taskId) {
    await db(tasksToUsersTable)
        .where('task_id', taskId)
        .del()
}

async function createTask(header, description){
    return await db(tasksTable)
                .returning('id')
                .insert({
                    header: header,
                    description: description
                });
}

async function updateTask(id, changes){
    return await db(tasksTable)
                // .returning('id')
                .where({id})
                .update(changes);
}

async function detachTaskFromUser(userId, taskId){
    return await db(tasksToUsersTable)
                .where('user_id', userId)
                .where('task_id', taskId)
                .del();
}

async function attachTaskToUser(userId, taskId){
    return await db(tasksToUsersTable)
                .returning('id')
                .insert({
                  user_id: userId,
                  task_id: taskId
                });
}

async function mappingExists(userId, taskId){
    const mapping = await db(tasksToUsersTable)
                        .where('user_id', userId)
                        .where('task_id', taskId);
    if (mapping.length)
        return true;
    return false;
}

async function getAllTasks(){
    var tasksFromDb = await db(tasksTable)
                        .leftJoin('task_user_map', 'tasks.id', 'task_user_map.task_id')
                        .leftJoin('users', 'users.id', 'task_user_map.user_id')
                        .select('tasks.id', 'tasks.header', 'tasks.description', 'task_user_map.user_id', 'users.username');
    console.log(tasksFromDb);
    var tasks = [];
    tasksFromDb.forEach(task => {
        const ind = tasks.findIndex(t => t.id === task.id)
        if (ind < 0){
            console.log(task.id);
            tasks.push({id: task.id, header: task.header, description: task.description, users: task.user_id === null ? [] : [{id:task.user_id, username: task.username}]});
        }
        else {
            tasks[ind].users.push({id: task.user_id, username: task.username});
        }
    });
    console.log(tasks);
    return tasks;
}


module.exports = {
    updateTask,
    createTask,
    deleteTask,
    findTaskById,
    detachTaskFromUser,
    attachTaskToUser,
    getAllTasks,
    mappingExists
}