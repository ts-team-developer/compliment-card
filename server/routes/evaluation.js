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

router.post('/save', async(req, res, next) => {
    try{
        // 자신이 추천한 카드는 추천할 수 없습니다.
        let connection = await pool.getConnection(async conn => conn)
        const cards = await connection.query(`SELECT * FROM praise_card WHERE SEQ =  ${req.body.seq}`);
        if(cards[0][0].sender == req.user.email) {
            connection.release();
            res.status(400).send({message:"자신이 칭찬한 카드는 추천할 수 없습니다."})
            return ;
        } else {
            let sql = `INSERT INTO card_check (SEQ, NAME_KOR, READ_DT, READ_TM, REC_FLAG, EVALUATION)   `;
            sql += `  VALUES ('${req.body.seq}', '${req.user.email}', DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(NOW(), '%H%i%s'), 'N', '${req.body.evaluation}')  `
            sql += ` ON DUPLICATE KEY UPDATE SEQ =  '${req.body.seq}', NAME_KOR ='${req.user.email}', READ_DT = DATE_FORMAT(NOW(), '%Y-%m-%d'), READ_TM = DATE_FORMAT(NOW(), '%H%i%s'), EVALUATION = '${req.body.evaluation}' `
            const data = await connection.query(sql)
            connection.release();
            return res.json(data)
        }
    }catch{
        return res.status(500).json(err)
    }
});


router.get('/list', async(req, res, next) => {
    try{
        let connection = await pool.getConnection(async conn => conn)
        const data = await connection.query(` SELECT SEQ, EVALUATION FROM card_check WHERE SEQ = ${seq} AND NAME_KOR = '${req.user.email}'`);
        connection.release();
        return res.json(data);
    }catch(err) {
        console.log(err)
    }
});


module.exports = router;