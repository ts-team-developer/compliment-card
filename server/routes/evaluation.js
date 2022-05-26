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
        if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
            let connection = await pool.getConnection(async conn => conn)
            const data = await connection.query(` SELECT SEQ, EVALUATION FROM card_check WHERE SEQ = ${seq} AND NAME_KOR = '${req.user.email}'`);
            connection.release();
            return res.json(data);
        }
    }catch(err) {
        console.log(err)
    }
});


module.exports = router;