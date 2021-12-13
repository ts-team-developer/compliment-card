const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: '10.0.1.103',
    port: '3306',
    user : 'praise_card',
    password : 'praise_card',
    database:'praise_card',
    connectionLimit: 1000
  });


  module.exports=pool