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

router.get('/selectAllBodyByQuarter', async(req, res, next) => {
  try{
      let connection = await pool.getConnection(async conn => conn)
      let sql = ` SELECT DISTINCT E.NAME_KOR `
      sql += ` FROM EMP E LEFT JOIN PRAISE_CARD P ON E.NAME_KOR = P.SENDER `
      sql += ` WHERE E.END_DATE IS NULL AND E.WORK_STS = 1 AND P.QUARTER='${req.user.quarterInfo.QUARTER}' `;
      const data = await connection.query(sql)
      connection.release();
      return res.json(data)
  } catch (err) {
      return res.status(500).json(err)
  }
});

router.get('/selectTotalMemberCountByQuarter', async(req, res, next) => {
  try{
      let connection = await pool.getConnection(async conn => conn)
      let sql = ` SELECT COUNT(DISTINCT E.NAME_KOR) AS COUNT `
      sql += ` FROM EMP E LEFT JOIN PRAISE_CARD P ON E.NAME_KOR = P.SENDER OR E.EMAIL =P.SENDER `
      sql += ` WHERE E.END_DATE IS NULL AND E.WORK_STS = 1 AND P.QUARTER='${req.query.quarter}' `;
      const data = await connection.query(sql)
      connection.release();
      return res.json(data)
  } catch (err) {
      return res.status(500).json(err)
  }
});

module.exports = router;