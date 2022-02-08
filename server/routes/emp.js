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
});

router.get('/list', async(req, res, next) => {
    try{
        let connection = await pool.getConnection(async conn => conn)
        const data = await connection.query('select * from emp where end_date is null and work_sts = 1 ')
        connection.release();
        return res.json(data)
    } catch (err) {
      console.log('test' + err)
        return res.status(500).json(err)
    }
});
module.exports = router;