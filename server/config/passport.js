const passport = require('passport');
const google = require('./google');
const pool = require('../config/pool')

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
    console.log(`serializeUser`)
    done(null, user);
  });
  
  // 매개변수 user는 req.session.passport에 저장된 값
  passport.deserializeUser(async function(user, done) {
    console.log(``)
    let connection = await pool.getConnection(async conn => conn)
    const data = await connection.query("SELECT QUARTER, ISCLOSED, ISRECCLOSED FROM CLOSED  ORDER BY QUARTER DESC LIMIT 0, 1 ");
    const menu = await connection.query(`SELECT * FROM MENU A INNER JOIN ROLEMENU B ON A.MENU_ID = B.MENU_ID INNER JOIN EMP C ON B.ROLE_CD = C.AUTH WHERE C.EMAIL = '${user.email}' ORDER BY ORDER_SQ `)
    connection.release();
    user.menuList = menu[0]
    // 오픈된 분기 정보 가져오기
    if(data[0][0] == null) user.quarter = '';
    else user.quarterInfo =data[0][0];
    console.log(`deserializeUser `)
    done(null, user);
  });
  
  google();
}