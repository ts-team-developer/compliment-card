const express = require('express');
const router = express.Router();
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
})

router.get('/getMenuList', async (req, res, next) => {
    try{
        let connection = await pool.getConnection(async conn => conn)
        const data = await connection.query(`SELECT * FROM MENU A INNER JOIN ROLEMENU B ON A.MENU_ID = B.MENU_ID INNER JOIN EMP C ON B.ROLE_CD = C.AUTH WHERE C.EMAIL = 'jang314@mnwise.com' ORDER BY ORDER_SQ `)
        connection.release();
        res.json(data[0][0])        
    }catch(err) {
        console.log(err)
      res.json(null)
    }
  })

module.exports = router;