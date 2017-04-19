const pgp = require('pg-promise')({});
const db = pgp({
    host: 'localhost',
    port: 5432,
    database: 'lockdown',
    user: 'lockdown',
    password: 'lockdown'
});

db.one('SELECT * FROM chat.messages')
    .then((data) => {
        console.log("DATA:", data.value);
    })
    .catch((error) => {
        console.log("ERROR:", error);
    });

module.exports = db;