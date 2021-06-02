const { v4: uuidv4 } = require('uuid');

const DB = []

function findUserById(id){
    return DB.find(user => user.id == id)
}

function initUser(username, email){
    const usersId = uuidv4()
    var user = {id: usersId, username: username, email: email}
    return user
}

function deleteUser(id){
    var user = findUserById(id);
    if (user == undefined){
        return false;
    }
    var index = DB.indexOf(user)
    DB.splice(index, 1)
    return true;
}

function createUser(username, email){
    var user = initUser(username, email)
    DB.push(user)
    return user.id
}

function updateUser(id, username, email){
    var user = findUserById(id);
    if (user == undefined){
        return false;
    }
    var index = DB.indexOf(user);

    DB[index].username = username;
    DB[index].email = email;
    return true;
}

function getAllUsers(){
    return DB;
}

// By unique email (identical username accepted for now)
function userExists(email){
    if (DB.find(user => user.email == email) == undefined){
        return false;
    }
    return true;
}

module.exports = {
    updateUser,
    createUser,
    deleteUser,
    findUserById,
    getAllUsers,
    userExists
}