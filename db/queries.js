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

module.exports = {
    getUsersAndMessages,
}