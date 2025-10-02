const db = require('./pool')

async function getUsersAndMessages() {
    try {
        const { rows } = await db.query(`
            SELECT username,
                 membership,
                      admin,
                      title,
                  timestamp,
                       text
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

module.exports = {
    getUsersAndMessages,
    getUserByUsername,
    getUser,
    getHash,
}