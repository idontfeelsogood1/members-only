const db = require('./pool')
const bcrypt = require('bcrypt')

async function getUsersAndMessages() {
    try {
        const { rows } = await db.query(`
            SELECT username,
                 membership,
                      admin,
                      title,
                  timestamp,
                       text,
        users.id AS user_id,
  messages.id AS message_id
  
            FROM users
            JOIN messages
              ON users.id = messages.user_id
        `)
        return rows
    } catch(err) {
        console.log("DB error in getUserAndMessages: ", err)
        throw new Error(err)
    }
}

async function getUserByUsername(username) {
    try {
        const { rows } = await db.query(`
            SELECT * FROM users
            WHERE username = $1    
        `, [username])
        return rows[0]
    } catch(err) {
        console.log("DB error in getUserByUsername: ", err)
        throw new Error(err)
    }
}

async function getUser(user_id) {
    try {
        const { rows } = await db.query(`
            SELECT * FROM users
            WHERE id = $1    
        `, [user_id])
        return rows[0]
    } catch(err) {
        console.log("DB error in getUser: ", err)
        throw new Error(err)
    }
}

async function getHash(user_id) {
    try {
        const { rows } = await db.query(`
            SELECT password_hash FROM users
            WHERE id = $1    
        `, [user_id])
        return rows[0].password_hash
    } catch(err) {
        console.log("DB error in getHash: ", err)
        throw new Error(err)
    }
}

async function addUser(firstname, lastname, username, password, isAdmin) {
    try {
        const hash = await bcrypt.hash(password, 10)
        await db.query(`
            INSERT INTO users (first_name, last_name, username, password_hash, membership, admin)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [firstname, lastname, username, hash, false, isAdmin])
    } catch(err) {
        console.log("DB error in getHash: ", err)
        throw new Error(err)
    }
}

async function setMembership(user_id, boolean) {
    try {
        await db.query(`
            UPDATE users
            SET membership = $1
            WHERE id = $2
        `, [boolean, user_id])
    } catch(err) {
        console.log("DB error at setMembership", err)
        throw new Error(err)
    }
}

async function addMessage(user_id, title, message) {
    try {
        await db.query(`
            INSERT INTO messages
            (user_id, title, text)
            VALUES 
            ($1, $2, $3)    
        `, [user_id, title, message])
    } catch(err) {
        console.log("DB error at addMessage", err)
        throw new Error(err)
    }
}

async function deleteMessage(message_id) {
    try {
        await db.query(`
            DELETE FROM messages
            WHERE id = $1
        `, [message_id])
    } catch(err) {
        console.log("DB error at deleteMessage", err)
        throw new Error(err)
    }
}

module.exports = {
    getUsersAndMessages,
    getUserByUsername,
    getUser,
    getHash,
    addUser,
    setMembership,
    addMessage,
    deleteMessage,
}