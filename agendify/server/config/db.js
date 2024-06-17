const mysql = require('mysql');

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "04022004",
    database: "agendify",
});

module.exports = db;
