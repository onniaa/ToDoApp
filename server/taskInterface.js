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
    return await db(tasksTable)
                .select();
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