const mysql = require('mysql');
const db = mysql.createPool({
    host : '10.0.1.103:3306',
    user: 'praise_card',
    password : 'praise_card',
    database : 'praise_card'
});

module.exports = db;