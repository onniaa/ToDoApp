const { default: knex } = require('knex');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/db');
const usersTable = 'users';

async function findUserById(id){
    return await db(usersTable)
                .where({id});
}

async function deleteUser(id){
    await db(usersTable)
        .where({id})
        .del();
}

async function createUser(username, email){
    return await db(usersTable)
                .returning('id')
                .insert({
                    username: username,
                    email: email
                })
}

// ADD: check if email is updated anf if so if in use already
async function updateUser(id, changes){
    return await db(usersTable)
                // .returning('id')
                .where({id})
                .update(changes);
}

async function getAllUsers(){
    return await db(usersTable)
                .select();
}

// By unique email (identical username accepted for now)
async function emailInUse(email){
    const usersWithEmail = await db(usersTable)
                                .where('email', email);
    if (usersWithEmail.length)
        return true;
    return false;
}

module.exports = {
    updateUser,
    createUser,
    deleteUser,
    findUserById,
    getAllUsers,
    emailInUse
}