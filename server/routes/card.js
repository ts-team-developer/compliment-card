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


router.get('/list', async(req, res, next) => {
    try{
            // cards : 5 - 안 읽은 카드, 4 - 추천카드(o), 3 - 전체카드(o) , 2 - 받은 카드 1-  내가쓴카드
            const {cards, score, quarter, category} = req.query;
            console.log(cards)
            let connection = await pool.getConnection(async conn => conn);
            let sql = ``;
            let quarterSql = ``;

            if(quarter == 0) quarterSql = req.user.quarterInfo.QUARTER
            else quarterSql = quarter;

            if(req.user === undefined) {
                res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
                return ;
            } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
                res.status(403).send({message : '잘못된 접근입니다. '});
                return ;
            } else {
                if(cards == 5) {
                    sql += ` SELECT SEQ, QUARTER, SENDER, (SELECT NAME_KOR FROM EMP WHERE EMAIL = RECEIVER OR NAME_KOR = RECEIVER ) AS RECEIVER, REPLACE(CONTENT, CHAR(10), '\n') AS CONTENT, SEND_DT, SEND_TM  `
                    sql += `  ,  (SELECT VALUE FROM CATEGORIES WHERE \`KEY\` = CATEGORY) AS CATEGORY `
                    sql += ` FROM praise_card P `
                    sql += ` WHERE  sender NOT IN ('${req.user.loginUser.EMAIL}', '${req.user.loginUser.NAME_KOR}')  and NOT EXISTS (SELECT 'x' FROM card_check C WHERE C.seq = P.seq AND NAME_KOR IN ('${req.user.loginUser.EMAIL}' ,'${req.user.loginUser.NAME_KOR}')) `
                    sql += `        AND QUARTER = '${quarterSql}'  `
                } else if(cards == 4) {
                    sql += ` SELECT p.SEQ, p.QUARTER, p.SENDER, c.READ_DT, c.READ_TM, (SELECT NAME_KOR FROM EMP WHERE EMAIL = p.RECEIVER OR NAME_KOR = p.RECEIVER) AS RECEIVER, REPLACE(p.CONTENT, CHAR(10), '\n') AS CONTENT, SUM(c.evaluation) AS EVALUATION, SEND_DT, SEND_TM `
                    sql += `   , (SELECT VALUE FROM CATEGORIES WHERE \`KEY\` = CATEGORY) AS CATEGORY `
                    sql += ` FROM  praise_card p, card_check c `
                    sql += ` WHERE p.seq=c.seq `
                    sql += (score > 0) ? ` AND c.evaluation = ${score}` : ` AND c.evaluation > 0 `;
                    sql += ` AND p.quarter=  '${quarterSql}' `
                    sql += ` GROUP BY c.seq ORDER BY evaluation DESC `
                } else if(cards == 3) {
                    sql += ` SELECT p.SEQ, p.QUARTER, p.SENDER,  (SELECT NAME_KOR FROM EMP WHERE EMAIL= p.RECEIVER OR NAME_KOR = p.RECEIVER) AS RECEIVER, REPLACE(P.CONTENT, CHAR(10), '\n') AS CONTENT, c.READ_DT, c.READ_TM, c.EVALUATION, SEND_DT, SEND_TM  `;
                    sql += `   , (SELECT VALUE FROM CATEGORIES WHERE \`KEY\` = CATEGORY) AS CATEGORY, p.SEND_DT, p.SEND_TM, IFNULL(c.READ_DT, '') AS READ_DT, IFNULL(c.READ_TM, '') AS READ_TM `
                    sql += ` FROM praise_card p LEFT OUTER JOIN card_check c ON p.seq=c.seq AND c.name_kor IN ('${req.user.loginUser.EMAIL}', '${req.user.loginUser.NAME_KOR}') `;
                    sql += ` WHERE p.quarter='${quarterSql}' `
                    sql +=  (score > 0) ? ` AND c.evaluation = ${score}` : ``;
                } else if( cards == 2) {
                    sql += ` SELECT p.SEQ, (SELECT NAME_KOR FROM EMP WHERE EMAIL = RECEIVER OR NAME_KOR = RECEIVER) AS RECEIVER ,SENDER, REPLACE(CONTENT, CHAR(10), '\n') AS CONTENT , READ_DT, READ_TM  `
                    sql += `   , (SELECT VALUE FROM CATEGORIES WHERE \`KEY\` = CATEGORY) AS CATEGORY `
                    sql += ` FROM   praise_card p right join card_check c on p.seq = c.seq  `;
                    sql += ` WHERE  RECEIVER IN ('${req.user.loginUser.EMAIL}', '${req.user.loginUser.NAME_KOR}') AND NAME_KOR IN ('${req.user.loginUser.EMAIL}', '${req.user.loginUser.NAME_KOR}') AND QUARTER ='${quarterSql}'  `;
                }  else if(cards == 1) {
                    sql += ` SELECT SEQ, (SELECT NAME_KOR FROM EMP WHERE EMAIL = RECEIVER OR NAME_KOR = RECEIVER) AS RECEIVER ,REPLACE(CONTENT, CHAR(10), '\n') AS CONTENT, SENDER, SEND_DT, SEND_TM  `
                    sql += `   , (SELECT VALUE FROM CATEGORIES WHERE \`KEY\` = CATEGORY) AS CATEGORY ` ;
                    sql += ` FROM praise_card p WHERE SENDER IN ('${req.user.loginUser.EMAIL}', '${req.user.loginUser.NAME_KOR}') AND QUARTER ='${quarterSql}' `;
                }

                sql += ` AND CATEGORY = ${category}`;
                const data = await connection.query(sql);
                connection.release();

                return res.json(data)
            }
    }catch (err){
        console.log(err)
        return res.status(500).send()
    }
});

router.get('/getEvaluationQuery', async(req, res, next) => {
    try{
        if(req.user === undefined) {
            return res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
            let connection = await pool.getConnection(async conn => conn)
            const data = await connection.query(` SELECT SEQ, EVALUATION FROM card_check WHERE SEQ = ${seq} AND NAME_KOR = '${req.user.loginUser.EMAIL}'`);
            connection.release();
            return res.json(data);
        }

    }catch(err) {
        console.log(err)
    }
});


router.get('/detail', async(req, res, next) => {
    try{
        if(req.user === undefined) {
            return res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
            let connection = await pool.getConnection(async conn => conn)
            let sql = ` SELECT A.SEQ, A.QUARTER, A.SENDER, A.RECEIVER, A.SEND_DT,A.SEND_TM, CATEGORY, REPLACE(A. CONTENT, CHAR(10), '\n') AS CONTENT `
            sql += ` FROM praise_card A WHERE SEQ = ${req.query.seq}`
            const data = await connection.query(sql)
            connection.release();
            return res.json(data)
        }
    }catch(err){
        return res.status(500).json(err)
    }
});


// 칭찬카드 등록
router.post('/save', async(req, res, next) => {
    let connection = await pool.getConnection(async conn => conn)
    const {receiver, content, seq, category} = req.body;
    const detailCard = await connection.query(`SELECT * FROM praise_card WHERE SEQ = ${seq}`);
    const oriReceiver = seq > 0 ? detailCard[0][0].receiver : receiver;

    let result = ((seq == 0) ? true : (receiver != oriReceiver));
    // 받은사람 중복확인
    const totalCnt = await connection.query(`SELECT COUNT(*) AS COUNT FROM praise_card WHERE QUARTER = '${req.user.quarterInfo.QUARTER}' AND SENDER = '${req.user.loginUser.EMAIL}' `);

    const sendQry = `SELECT COUNT(*) AS COUNT FROM praise_card WHERE QUARTER = '${req.user.quarterInfo.QUARTER}' AND SENDER = '${req.user.loginUser.EMAIL}' AND RECEIVER = '${receiver}'`
    const sendCnt =  await connection.query( sendQry );
    const resultCard = await connection.query(` SELECT COUNT(*) AS COUNT FROM EMP WHERE WORK_STS = 1 AND EMAIL = '${receiver}'`);

    let preSql = `SELECT COUNT(*) AS COUNT FROM praise_card A LEFT JOIN EMP B ON A.RECEIVER = B.EMAIL  `;
    preSql += ` LEFT JOIN EMP C ON A.SENDER = C.EMAIL  AND B.WORK_STS = 1 `
    preSql += ` WHERE QUARTER = '${req.user.quarterInfo.QUARTER}' AND SENDER = '${req.user.loginUser.EMAIL}' AND B.TEAM != C.TEAM `

    const preCard = await connection.query(preSql);
    const afterCard = await connection.query( ` SELECT COUNT(*) AS COUNT FROM EMP WHERE TEAM NOT IN ( SELECT TEAM FROM EMP WHERE EMAIL = '${req.user.loginUser.EMAIL}' ) AND EMAIL = '${receiver}'`);

    try{
        if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else if (req.user.quarterInfo.ISCLOSED != 'N') {
            res.status(400).send({message:"칭찬카드 작성 기간이 아닙니다. "})
            return ;
        } else if(content.length < 50) {
            res.status(400).send({message:"칭찬 내용은 50자 이상 작성해주세요. "})
            connection.release();
            return ;
        } else if (receiver == '') {
            res.status(400).send({message:" 칭찬 받을 사람을 선택해주세요. "})
            connection.release();
            return ;
        } else if(receiver == req.user.loginUser.EMAIL) {
            res.status(400).send({message:" 본인은 칭찬할 수 없습니다. "})
            connection.release();
            return ;
        }else if(sendCnt[0][0].COUNT > 0 && result){
            res.status(400).send({message:" 이미 칭찬한 카드입니다."})
            connection.release();
            return ;
        }else if(totalCnt[0][0].COUNT >= 3 && seq == 0) {
            res.status(400).send({message:" 분기 당 세개 까지만 칭찬 가능합니다."})
            connection.release();
            return ;
        } else if(preCard[0][0].COUNT == 0 && afterCard[0][0].COUNT == 0 && result) {
            res.status(400).send({message:"타 팀 먼저 칭찬해주세요. "})
            connection.release();
            return ;
        } else if(resultCard[0][0].COUNT == 0 && result)  {
            res.status(400).send({message:"존재하지 않는 직원입니다. "});
            connection.release();
            return ;
        } else if (category == '') {
            res.status(400).send({message:" 카테고리를 선택해주세요. "})
            connection.release();
            return ;
        } else {
            //등록쿼리
            let sql =""
            if(seq == 0) {
                sql += `INSERT INTO praise_card (QUARTER, RECEIVER, SENDER, CATEGORY, SEND_DT, SEND_TM, CONTENT)   `;
                sql += `  VALUES ('${req.user.quarterInfo.QUARTER}', '${receiver}', '${req.user.loginUser.EMAIL}', '${category}' ,DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(NOW(), '%H:%i:%s'), '${content}')`;
            } else {
                sql += ` UPDATE praise_card SET RECEIVER = '${receiver}' , SEND_DT = DATE_FORMAT(NOW(), '%Y-%m-%d'), SEND_TM=DATE_FORMAT(NOW(), '%H:%i:%s'), CATEGORY = '${category}' , CONTENT='${content}'`;
                sql += `  WHERE SEQ =  ${seq} AND SENDER = '${req.user.loginUser.EMAIL}' `;
            }

            const data = await connection.query(sql)
            connection.release();

            res.send({message : "칭찬카드가 정상적으로 작성되었습니다.", lists : data});
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
});

router.get('/bestcard', async(req, res, next) => {
    try{
        if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
            let connection = await pool.getConnection(async conn => conn)

            sql = ` SELECT B.SEQ,A.QUARTER AS QUARTER  ,B.CONTENT AS CONTENT, B.RECEIVER AS RECEIVER , '' AS CATEGORY  `;
            sql += `   FROM (  `;
            sql += ` 	        SELECT  QUARTER, MAX(EVALUATION) AS EVALUATION `;
            sql += `            FROM ( `;
            sql += `                 SELECT p.quarter AS QUARTER, SUM(c.evaluation) AS EVALUATION  `;
            sql += `                     FROM card_check c , praise_card p `;
            sql += `                    WHERE c.evaluation > 0  `;
            sql += `                      AND c.seq = p.seq `;
            sql += `                    GROUP BY p.quarter,c.seq                  ) X  `;
            sql += `           GROUP BY QUARTER         ) A,  `;
            sql += `        ( `;
            sql += `            SELECT p.seq AS SEQ, p.quarter AS QUARTER, p.receiver AS RECEIVER, p.content AS CONTENT, SUM(c.evaluation) AS EVALUATION `;
            sql += `              FROM card_check  c, praise_card p    `;
            sql += `             WHERE c.evaluation > 0 AND c.seq = p.seq   `;
            sql += `             GROUP BY p.quarter,c.seq ) B, `;
            sql += `        (  SELECT quarter FROM closed WHERE isClosed = 'Y'  AND isRecClosed = 'Y' ) C  `
            sql += `              WHERE A.EVALUATION = B.EVALUATION  AND A.QUARTER = B.QUARTER AND C.QUARTER = A.QUARTER  AND C.QUARTER = B.QUARTER `
            sql += ` UNION ALL `
            sql += ` SELECT SEQ, QUARTER, CONTENT, `;
            sql += ` (SELECT NAME_KOR FROM EMP WHERE EMAIL= RECEIVER ) AS RECEIVER ,  `
            sql += ` (SELECT VALUE FROM CATEGORIES WHERE \`KEY\` = C.CATEGORY) AS CATEGORY  `
            sql += `      FROM ( `;
            sql += `        SELECT * , COUNT(*) AS COUNT `;
            sql += `        FROM PRAISE_CARD PC  `;
            sql += `        WHERE CATEGORY IS NOT NULL  `;
            sql += `        GROUP BY QUARTER , CATEGORY , RECEIVER  `;
            sql += `      ) C INNER JOIN ( `;
            sql += `        SELECT MAX(COUNT) AS BEST ,CATEGORY`;
            sql += `        FROM ( `;
            sql += `            SELECT *, COUNT(*) AS COUNT `;
            sql += `            FROM PRAISE_CARD PC  `;
            sql += `            WHERE CATEGORY IS NOT NULL `;
            sql += `            GROUP BY  QUARTER , CATEGORY , RECEIVER `
            sql += `      ) E   	`;
            sql += `    GROUP BY CATEGORY 	`;
            sql += `    ) D ON C.COUNT = D.BEST AND C.CATEGORY = D.CATEGORY `;

            const list = (req.user.loginUser.AUTH == 'ADM' || (req.user.quarterInfo.ISCLOSED == "Y" && req.user.quarterInfo.ISCRECLOSED == "Y") ) ? await connection.query(sql) : null;

            connection.release();
            return res.json(list[0])
        }
    }catch (error){
        console.log(error)
        return res.status(500).json()
    }
});

router.post('/evaluation', async(req, res, next) => {
    try{
        // 자신이 추천한 카드는 추천할 수 없습니다.
        let connection = await pool.getConnection(async conn => conn)
        const cards = await connection.query(`SELECT * FROM praise_card WHERE SEQ =  ${req.body.seq}`);
        if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else if(cards[0][0].sender == req.user.email) {
            connection.release();
            res.status(400).send({message:"자신이 칭찬한 카드는 추천할 수 없습니다."})
            return ;
        } else {
            let sql = `INSERT INTO card_check (SEQ, NAME_KOR, READ_DT, READ_TM, REC_FLAG, EVALUATION)   `;
            sql += `  VALUES ('${req.body.seq}', '${req.user.loginUser.EMAIL}', DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(NOW(), '%H%i%s'), 'N', '${req.body.evaluation}')  `
            sql += ` ON DUPLICATE KEY UPDATE SEQ =  '${req.body.seq}', NAME_KOR ='${req.user.loginUser.EMAIL}', READ_DT = DATE_FORMAT(NOW(), '%Y-%m-%d'), READ_TM = DATE_FORMAT(NOW(), '%H%i%s'), EVALUATION = '${req.body.evaluation}' `
            const data = await connection.query(sql);
            connection.release();
            res.send({message : "정상 처리 되었습니다.", data : data});
        }
    }catch (err){
        console.log(err)
        return res.status(500).json(err)
    }
});


router.post('/delete', async(req, res, next) => {
    try{
        if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        }else {
            let connection = await pool.getConnection(async conn => conn)
            let sql = ` SELECT COUNT(*) AS COUNT FROM praise_card A LEFT JOIN EMP B ON A.RECEIVER = B.EMAIL `
            sql += `LEFT JOIN EMP C ON A.SENDER = C.EMAIL  AND B.WORK_STS = 1 `
            sql += ` WHERE QUARTER = '${req.user.quarterInfo.QUARTER}' AND SENDER = '${req.user.loginUser.EMAIL}'  AND B.TEAM != C.TEAM and SEQ != ${req.body.seq}`;

            let selectCountAllMyCard = 'SELECT count(*) FROM parise_card WHERE QUARTER = '${req.user.quarterInfo.QUARTER}' AND SENDER = '${req.user.loginUser.EMAIL}';
            const selectCountAllMyCardData = await connection.query(selectCountAllMyCard);

            let selectSenderSql = `SELECT SENDER FROM praise_card WHERE SEQ = '${req.body.seq}' `;
            const data = await connection.query(sql)
            const selectSender = await connection.query(selectSenderSql);

            if(req.user.quarterInfo.ISCLOSED != 'N') {
                res.status(400).send({message:"칭찬카드 작성 기간이 아닙니다. "})
                connection.release();
                return ;
            } else if(data[0][0].COUNT == 0 && selectCountAllMyCardData[0][0] > 1) {
                res.status(400).send({message:"타 팀 먼저 칭찬 후 삭제해주세요 "})
                connection.release();
                return ;
            } else if (selectSender[0][0].SENDER != req.user.loginUser.EMAIL) {
                res.status(400).send({message:"본인이 작성한 카드만 삭제할 수 있습니다. "})
                connection.release();
                return ;
            } else {
                await connection.query(`delete from praise_card WHERE SEQ = ${req.body.seq} `)
                res.send({message : "칭찬카드가 정상적으로 삭제되었습니다. "});
                connection.release();
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
});

module.exports = router;
