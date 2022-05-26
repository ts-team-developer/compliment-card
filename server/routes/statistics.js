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


    // 년도별 통계
    router.get('/year', async(req, res, next) => {
        try{
            if(req.user === undefined) {
                return res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
                res.status(403).send({message : '잘못된 접근입니다. '});
                return ;
            } else {
                let connection = await pool.getConnection(async conn => conn)
                let user = (req.query.isPraise=='Y' ? 'RECEIVER' : 'SENDER');
                let sql = `SELECT @ROWNUM := @ROWNUM+1 AS id , (SELECT NAME_KOR FROM EMP WHERE EMAIL = P.${user} OR NAME_KOR = P.${user} ) AS name, `;

                sql += `COUNT(CASE WHEN QUARTER LIKE '%1분기' THEN 0 END) AS 'Q1', `;
                sql += `COUNT(CASE WHEN QUARTER LIKE '%2분기' THEN 0 END) AS 'Q2', `;
                sql += `COUNT(CASE WHEN QUARTER LIKE '%3분기' THEN 0 END) AS 'Q3', `;
                sql += `COUNT(CASE WHEN QUARTER LIKE '%4분기' THEN 0 END) AS 'Q4'  `;
                sql += `FROM EMP E JOIN PRAISE_CARD P ON P.${user} IN (E.NAME_KOR , E.EMAIL ), (SELECT @ROWNUM :=0) AS R `;
                sql += `WHERE QUARTER LIKE '${req.query.quarter}%' GROUP BY P.${user} `;

                const data = await connection.query(sql)
                connection.release();
                return res.json(data)
            }
        } catch (err) {
            return res.status(500).json(err)
        }
    });

    // 직원별 통계
    router.get('/emp', async(req, res, next) => {
        try{
            if(req.user === undefined) {
                return res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
                res.status(403).send({message : '잘못된 접근입니다. '});
                return ;
            } else {
                let connection = await pool.getConnection(async conn => conn)
                
                let sql = `SELECT SEQ, QUARTER, DATE_FORMAT(SEND_DT,'%Y/%m/%d') AS SEND_DT, SEND_TM, CONTENT,     `
                sql += ` (SELECT \`VALUE\` FROM CATEGORIES WHERE \`KEY\`= CATEGORY ) AS CATEGORY, `;
                sql += ` (SELECT NAME_KOR FROM EMP WHERE EMAIL = RECEIVER OR NAME_KOR = RECEIVER ) AS RECEIVER, `;
                sql += ` (SELECT NAME_KOR FROM EMP WHERE EMAIL = SENDER OR NAME_KOR = SENDER ) AS SENDER `;
                sql += ` FROM PRAISE_CARD  WHERE QUARTER ='${req.query.quarter}' `;
                sql += req.query.receiver ? ` AND RECEIVER ='${req.query.receiver}'` : ``;
                const data = await connection.query(sql)
                connection.release();
                return res.json(data)
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    });

    // 년도별 점수 통계
    router.get('/point', async(req, res, next) => {
        try{
            if(req.user === undefined) {
                return res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
                res.status(403).send({message : '잘못된 접근입니다. '});
                return ;
            } else {
                let connection = await pool.getConnection(async conn => conn)
                
                let quarter = req.query.quarter;


                let sql = `SELECT @ROWNUM := @ROWNUM+1 AS idx, (SELECT NAME_KOR FROM EMP WHERE EMAIL = P.SENDER OR NAME_KOR = P.SENDER ) AS SENDER, '${quarter}' AS QUARTER, SUM(C.EVALUATION ) AS SUM, P.CONTENT `
                sql += `FROM PRAISE_CARD P LEFT JOIN CARD_CHECK C ON P.SEQ=C.SEQ, (SELECT @ROWNUM :=0) AS R `;
                sql += `WHERE P.QUARTER LIKE '${quarter}%' GROUP BY P.SENDER ORDER BY SUM DESC`;

                const data = await connection.query(sql)
                connection.release();
                return res.json(data)
            }
        } catch (err) {
            return res.status(500).json(err)
        }
    });
    

module.exports = router;