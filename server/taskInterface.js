const { v4: uuidv4 } = require('uuid');

const DB = []

const taskUserMap = []

function findTaskById(id){
    return DB.find(task => task.id == id);
}

function initTask(header, description){
    const taskId = uuidv4();
    var task = {id: taskId, header: header, description: description};
    return task;
}

function deleteTask(id){
    var task = findTaskById(id);
    if (task == undefined){
        return false;
    }
    var index = DB.indexOf(task)
    DB.splice(index, 1)
    return true;
}

function createTask(header, description){
    var task = initTask(header, description);
    DB.push(task);
    return task.id;
}

function updateTask(id, header, description){
    var task = findTaskById(id);
    if (task == undefined){
        return false;
    }
    var index = DB.indexOf(task);

    DB[index].header = header;
    DB[index].description = description;
    return true;
}

function initMapping(userId, taskId){
    const mappingId = uuidv4();
    var mapping = {id: mappingId, userId: userId, taskId: taskId};
    return mapping;
}

function detachTaskFromUser(userId, taskId){
    var mapping = taskUserMap.find(mapping => mapping.userId == userId && mapping.taskId == taskId);
    if (mapping != undefined){
        var index = taskUserMap.indexOf(mapping);
        taskUserMap.splice(index, 1);
    }
}

function attachTaskToUser(userId, taskId){
    var mapping = initMapping(userId, taskId);
    taskUserMap.push(mapping);
    return mapping;
}

function getAllTasks(){
    return DB;
}

module.exports = {
    updateTask,
    createTask,
    deleteTask,
    findTaskById,
    detachTaskFromUser,
    attachTaskToUser,
    getAllTasks
}