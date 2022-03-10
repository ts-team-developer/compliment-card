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
        const {cards, quarter} = req.query;
        
        if(req.user === undefined) {
            return res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
          } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
          } else {
            let connection = await pool.getConnection(async conn => conn)
            
            let sql = "";
            let tmp = "";

            if(req.user.quarterInfo.QUARTER!=req.query.quarter){
              tmp = "AND P.QUARTER='${quarter}";
            }
            
            sql += ` SELECT @ROWNUM := @ROWNUM+1 AS idx, E.NAME_KOR AS name, `
            sql += ` (SELECT COUNT(*) FROM PRAISE_CARD P WHERE P.QUARTER ='${quarter}' AND P.SENDER IN (E.EMAIL, E.NAME_KOR)) AS card, `
            sql += ` (SELECT COUNT(*) FROM CARD_CHECK C LEFT JOIN PRAISE_CARD P ON C.SEQ=P.SEQ WHERE  P.QUARTER='${quarter}' AND C.NAME_KOR IN (E.NAME_KOR, E.EMAIL)) AS readCard, `;
            sql += ` (SELECT COUNT(*) FROM PRAISE_CARD P WHERE P.SENDER NOT IN (E.NAME_KOR, E.EMAIL) AND NOT EXISTS (SELECT 'X' FROM CARD_CHECK C WHERE C.SEQ = P.SEQ AND NAME_KOR IN (E.NAME_KOR, E.EMAIL)) AND QUARTER = '${quarter}') AS unreadCard, `
            sql += ` (SELECT COUNT(*) FROM PRAISE_CARD WHERE RECEIVER=E.NAME_KOR AND QUARTER='${quarter}') AS receiveCard `
            sql += ` FROM EMP E LEFT JOIN PRAISE_CARD P ON E.NAME_KOR = P.SENDER OR E.EMAIL =P.SENDER, (SELECT @ROWNUM :=0) AS R `
            if(cards==1){
                sql += ` WHERE E.END_DATE IS NULL AND E.WORK_STS = 1 `
                if(req.user.quarterInfo.QUARTER!=req.query.quarter){
                  sql += `AND P.QUARTER='${quarter}`;
                }   
            }else if(cards==2){
                sql += ` WHERE E.END_DATE IS NULL AND E.WORK_STS = 1 AND E.EMAIL NOT IN (SELECT SENDER FROM PRAISE_CARD P WHERE P.QUARTER='${quarter}') AND E.NAME_KOR NOT IN (SELECT SENDER FROM PRAISE_CARD P WHERE P.QUARTER='${quarter}') `
            }else if(cards==3){
                sql += ` WHERE E.END_DATE IS NULL AND E.WORK_STS = 1 AND EXISTS (SELECT SENDER FROM PRAISE_CARD P WHERE P.SENDER NOT IN (E.NAME_KOR, E.EMAIL) AND NOT EXISTS (SELECT 'X' FROM CARD_CHECK C WHERE C.SEQ = P.SEQ AND NAME_KOR IN (E.NAME_KOR, E.EMAIL))`
                if(req.user.quarterInfo.QUARTER!=req.query.quarter){
                  sql += `AND QUARTER = '${quarter}' `
                }  
                sql += `)`
            }

            sql += ` GROUP BY E.EMAIL ORDER BY E.NAME_KOR `

            const data = await connection.query(sql)
            connection.release();
            return res.json(data)
          }
    } catch (err) {
        return res.status(500).json(err)
    }
  });
  
  // 칭찬 분기에 따른 회사 전체 인원 수 조회
  router.get('/totalMemberCount', async(req, res, next) => {
    try{
        if(req.user === undefined) {
          return res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
          res.status(403).send({message : '잘못된 접근입니다. '});
          return ;
        } else {
          let connection = await pool.getConnection(async conn => conn)
          let sql = ``

          if(req.user.quarterInfo.QUARTER==req.query.quarter && (req.user.quarterInfo.ISCLOSED=='N' || req.user.quarterInfo.ISRECCLOSED=='N')){
            sql += `SELECT COUNT(*) AS COUNT FROM EMP E WHERE E.END_DATE IS NULL AND E.WORK_STS = 1 `
          } else {
            sql += ` SELECT COUNT(DISTINCT E.EMAIL) AS COUNT `
            sql += ` FROM EMP E LEFT JOIN PRAISE_CARD P ON P.SENDER IN ( E.NAME_KOR, E.EMAIL) `
            sql += ` WHERE E.END_DATE IS NULL AND E.WORK_STS = 1 AND P.QUARTER='${req.query.quarter}' `;
          }
          
          const data = await connection.query(sql)
          connection.release();
          return res.json(data)
        }
    } catch (err) {
        return res.status(500).json(err)
    }
  });

    // 미작성 인원 수 조회
    router.get('/unwrittenMemberCount', async(req, res, next) => {
    try{
        if(req.user === undefined) {
            return res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
            let connection = await pool.getConnection(async conn => conn)
            
            let sql = `SELECT COUNT(DISTINCT E.EMAIL) AS COUNT FROM EMP E , PRAISE_CARD P `
            sql += ` WHERE E.END_DATE IS NULL AND E.WORK_STS = 1 AND E.EMAIL NOT IN (SELECT SENDER FROM PRAISE_CARD P WHERE P.QUARTER='${req.user.quarterInfo.QUARTER}') `
            sql += ` AND E.NAME_KOR NOT IN (SELECT SENDER FROM PRAISE_CARD P WHERE P.QUARTER='${req.user.quarterInfo.QUARTER}') `
            
            const data = await connection.query(sql)
            connection.release();
            return res.json(data)
        }
    } catch (err) {
        return res.status(500).json(err)
    }
    });

    // 미투표 인원 수 조회
    router.get('/unreadMemberCount', async(req, res, next) => {
        try{
            if(req.user === undefined) {
                return res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
                res.status(403).send({message : '잘못된 접근입니다. '});
                return ;
            } else {
                let connection = await pool.getConnection(async conn => conn)
                
                let sql = `SELECT COUNT(DISTINCT E.EMAIL) AS COUNT FROM EMP E LEFT JOIN PRAISE_CARD P ON E.NAME_KOR = P.SENDER OR E.EMAIL =P.SENDER `
                sql += ` WHERE E.END_DATE IS NULL AND E.WORK_STS = 1 AND EXISTS (SELECT SENDER FROM PRAISE_CARD P WHERE P.SENDER NOT IN (E.NAME_KOR, E.EMAIL) `
                sql += ` AND NOT EXISTS (SELECT 'X' FROM CARD_CHECK C WHERE C.SEQ = P.SEQ AND NAME_KOR IN (E.NAME_KOR, E.EMAIL)) AND QUARTER = '${req.user.quarterInfo.QUARTER}') `
                
                const data = await connection.query(sql)
                connection.release();
                return res.json(data)
            }
        } catch (err) {
            return res.status(500).json(err)
        }
    });

module.exports = router;