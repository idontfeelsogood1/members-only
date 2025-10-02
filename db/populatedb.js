// users
    // id
    // first_name
    // last_name
    // username
    // password_hash
    // membership
    // admin

// messages
    // id
    // title
    // timestamp
    // text
    // user_id

const { Client } = require('pg')
const { hash } = require('bcrypt')
require('dotenv').config()

const client = new Client({
    connectionString: process.env.DB_STRING
})

async function populatedb() {
    console.log("Connecting...")
    try {
        await client.connect()

        // Create tables
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                username VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                membership BOOLEAN DEFAULT FALSE,
                admin BOOLEAN DEFAULT FALSE
            );

            CREATE TABLE messages (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                title VARCHAR(255) NOT NULL,
                text TEXT NOT NULL
            );

            CREATE TABLE "session" (
            "sid" varchar NOT NULL COLLATE "default",
            "sess" json NOT NULL,
            "expire" timestamp(6) NOT NULL
            )
            WITH (OIDS=FALSE);
            ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
            CREATE INDEX "IDX_session_expire" ON "session" ("expire");
        `)

        // Insert dummy data
        const hash1 = await hash('12345678', 10)
        const hash2 = await hash('12345678', 10)
        const hash3 = await hash('12345678', 10)
        await client.query(`
            INSERT INTO users (first_name, last_name, username, password_hash, membership, admin)
            VALUES 
            ('Alice', 'Nguyen', 'alice123', $1, FALSE, FALSE),
            ('Jake', 'Chan', 'jake1234', $2, FALSE, TRUE),
            ('Bob', 'Tran', 'bobtran1', $3, TRUE, FALSE);
        `, [hash1, hash2, hash3])
        await client.query(`
            INSERT INTO messages (user_id, title, text)
            VALUES
            (1, 'Hello World', 'This is Alice’s first message.'),
            (1, 'Study Note', 'Alice is preparing for exams.'),
            (2, 'Admin Post', 'Jake created this admin announcement.'),
            (2, 'Reminder', 'System maintenance scheduled tomorrow.'),
            (3, 'Membership bought', 'I just got membership.'),
            (3, 'My name', 'Bob.');    
        `)

        await client.end()
    } catch(err) {
        console.log("Populate db failed.")
        throw new Error(err)
    }
    console.log("Populated db.")
}

populatedb()