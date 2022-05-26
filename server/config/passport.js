const passport = require('passport');
const google = require('./google');
const pool = require('../config/pool');
const axios = require('axios');

pool.getConnection((err, connection) => {
    if (err) {
        switch (err.code) {
          case "PROTOCOL_CONNECTION_LOST":
            console.error("Database connection was closed.");
            break;
          case "ER_CON_COUNT_ERROR":
            console.error("Database has too many connections.");
            break;
          case "ECONNREFUSED":
            console.error("Database connection was refused.");
            break;
        }
      }
      if (connection) return connection.release();
})


module.exports = () => {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  // 매개변수 user는 req.session.passport에 저장된 값
  passport.deserializeUser(async function(user, done) {
    let connection = await pool.getConnection(async conn => conn)
    const data = await connection.query("SELECT QUARTER, ISCLOSED, ISRECCLOSED FROM CLOSED  ORDER BY QUARTER DESC LIMIT 0, 1 ");
    
    connection.release();
    
    // 오픈된 분기 정보 가져오기
    if(data[0][0] == null) user.quarter = '';
    else user.quarterInfo =data[0][0];
    return done(null, user);
  
  });
  

  google();
}