const express  = require('express');
var router   = express.Router();
const pool = require('../config/pool')

pool.getConnection((err, connection) => {
    if (err) {
        switch (err.code) {
          case `PROTOCOL_CONNECTION_LOST`:
            console.error(`Database connection was closed.`);
            break;
          case `ER_CON_COUNT_ERROR`:
            console.error(`Database has too many connections.`);
            break;
          case `ECONNREFUSED`:
            console.error(`Database connection was refused.`);
            break;
        }
      }
      if (connection) return connection.release();
});

router.get('/list', async(req, res, next) => {
    try{
      if(req.user === undefined) {
        return res.json(null)
      } else {
        let connection = await pool.getConnection(async conn => conn)
        console.log("menu : "+JSON.stringify(req.user))
        const data = await connection.query(`SELECT * FROM MENU A INNER JOIN ROLEMENU B ON A.MENU_ID = B.MENU_ID INNER JOIN EMP C ON B.ROLE_CD = C.AUTH WHERE C.EMAIL = '${req.user.loginUser.EMAIL}' ORDER BY ORDER_SQ`)
        connection.release();
        return res.json(data[0])
      }
    }catch (err){
        console.log(err)
        return res.status(500).json(err)
    }
});

module.exports = router;