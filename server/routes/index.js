const express = require('express');
const router = express.Router();
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




router.get('/selectbody', async(req, res, next) => {
    try{
        let connection = await pool.getConnection(async conn => conn)
        const data = await connection.query('select * from emp where end_date is null and work_sts = 1 ')
        connection.release();
        return res.json(data)
    } catch (err) {
        return res.status(500).json(err)
    }
});

router.get('/getCardsIWriteQuery', async(req, res, next) => {
    try{
        // cards : 5 - 안 읽은 카드, 4 - 추천카드(o), 3 - 전체카드(o) , 2 - 받은 카드
        const {cards, score, quarter} = req.query;
        let connection = await pool.getConnection(async conn => conn);
        let sql = "";
        let quarterSql = "";
        
        if(quarter == 0) quarterSql = "2021년도 1분기" 
        else quarterSql = quarter;

        if(cards == 5) {
            sql += " SELECT SEQ, QUARTER, SENDER, RECEIVER, CONTENT, SEND_DT, SEND_TM FROM praise_card_202111 P WHERE  sender <> '장혜진' and NOT EXISTS (SELECT 'x' FROM card_check_202111 C WHERE C.seq = P.seq AND name_kor = '장혜진')"
            sql += " AND QUARTER = '" + quarterSql + "' "
        } else if(cards == 4) {
            sql += " SELECT p.SEQ, p.QUARTER, p.SENDER, p.RECEIVER, p.CONTENT, SUM(c.evaluation) AS EVALUATION, SEND_DT, SEND_TM "
            sql += " FROM  praise_card_202111 p, card_check_202111 c "
            sql += " WHERE p.seq=c.seq " 
            sql += (score > 0) ? " AND c.evaluation = " + score : " AND c.evaluation > 0 ";
            sql += " AND p.quarter= '" + quarterSql + "' "
            sql += " GROUP BY c.seq ORDER BY evaluation DESC "
        } else if(cards == 3) {
            sql += " SELECT p.SEQ, p.QUARTER, p.SENDER, p.RECEIVER, p.CONTENT, c.READ_DT, c.READ_TM, c.EVALUATION, SEND_DT, SEND_TM  ";
            sql += " FROM praise_card_202111 p LEFT OUTER JOIN card_check_202111 c ON p.seq=c.seq AND c.name_kor= '장혜진' ";
            sql += " WHERE p.quarter='" + quarterSql + "' "
            sql +=  (score > 0) ? " AND c.evaluation = " + score : " ";
        } else if( cards == 2) {
            sql += " SELECT SEQ,RECEIVER,CONTENT, SEND_DT, SEND_TM FROM praise_card_202111 p WHERE RECEIVER='장혜진' AND QUARTER ='" + quarterSql + "' "
        }

        const data = await connection.query(sql);

        connection.release();

        return res.json(data)
    }catch (err){
        console.log(err)
        return res.status(500).send()
    }
});

router.get('/getEvaluationQuery', async(req, res, next) => {
    try{

        console.log("1 L "+req)
        let connection = await pool.getConnection(async conn => conn)
        const data = await connection.query(" SELECT SEQ, EVALUATION FROM CARD_CHECK_202111 WHERE SEQ = " + seq + " AND NAME_KOR = '장혜진'");
        connection.release();
        return res.json(data);
    }catch(err) {
        console.log(err)
    }
});

router.get('/getIsClosedQuery', async(req, res, next) => {
    try{
        let connection = await pool.getConnection(async conn => conn)
        const data = await connection.query("SELECT * FROM CLOSED WHERE QUARTER = '2021년도 2분기'  ")
        connection.release();
        return res.json(data)
    }catch (err){
        console.log(err)
        return res.status(500).json(err)
    }
});

router.get('/getCardsDetailQuery', async(req, res, next) => {
    try{
        let connection = await pool.getConnection(async conn => conn)
        let sql = " SELECT A.SEQ, A.QUARTER, A.SENDER, A.RECEIVER, A.SEND_DT,A.SEND_TM, A.CONTENT "
        sql += " FROM PRAISE_CARD_202111 A WHERE SEQ = " + req.query.seq
        const data = await connection.query(sql)
        connection.release();
        return res.json(data)
    }catch{
        return res.status(500).json(err)
    }
});

router.all('/doCardCheckTable', async(req, res, next) => {
    try{
        // 자신이 추천한 카드는 추천할 수 없습니다.
        let connection = await pool.getConnection(async conn => conn)
        const cards = await connection.query("SELECT * FROM PRAISE_CARD_202111 WHERE SEQ = " + req.body.seq);
        if(cards[0][0].sender == '장혜진') {
            connection.release();
            res.status(400).send({message:"자신이 칭찬한 카드는 추천할 수 없습니다."})
            return ;
        } else {
            let sql = "INSERT INTO CARD_CHECK_202111 (SEQ, NAME_KOR, READ_DT, READ_TM, REC_FLAG, EVALUATION)   ";
            sql += "  VALUES ('" + req.body.seq +  "', '장혜진', DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(NOW(), '%H%i%s'), 'N', '" + req.body.evaluation + "')  "
            sql += " ON DUPLICATE KEY UPDATE SEQ =  '" + req.body.seq + "', NAME_KOR ='장혜진', READ_DT = DATE_FORMAT(NOW(), '%Y-%m-%d'), READ_TM = DATE_FORMAT(NOW(), '%H%i%s'), EVALUATION = '" + req.body.evaluation + "'"
            const data = await connection.query(sql)
            connection.release();
            return res.json(data)
        }
    }catch{
        return res.status(500).json(err)
    }
});


// 칭찬카드 등록
router.post('/register', async(req, res, next) => {
    let connection = await pool.getConnection(async conn => conn)
    
    const {receiver, content, seq} = req.body;

    const detailCard = await connection.query("SELECT * FROM PRAISE_CARD_202111 WHERE SEQ = " + seq);
    const oriReceiver = detailCard[0][0].receiver;

    let result = ((seq == 0) ? true : (receiver != oriReceiver));
    // 받은사람 중복확인
    const totalCnt = await connection.query("SELECT COUNT(*) AS COUNT FROM PRAISE_CARD_202111 WHERE QUARTER = '2021년도 1분기' AND SENDER = '장혜진' ")
    
    const sendQry = "SELECT COUNT(*) AS COUNT FROM PRAISE_CARD_202111 WHERE QUARTER = '2021년도 1분기' AND SENDER = '장혜진' AND RECEIVER = '" + receiver + "'"
    const sendCnt =  await connection.query( sendQry );
    const resultCard = await connection.query(" SELECT COUNT(*) AS COUNT FROM EMP WHERE WORK_STS=1 AND NAME_KOR ='"+receiver+"' ");

    let preSql = "SELECT COUNT(*) AS COUNT FROM PRAISE_CARD_202111 A LEFT JOIN EMP B ON A.RECEIVER = B.NAME_KOR  ";
    preSql += " LEFT JOIN EMP C ON A.SENDER = C.NAME_KOR  AND B.WORK_STS = 1 "
    preSql += " WHERE QUARTER = '2021년도 1분기' AND SENDER = '장혜진' AND B.TEAM != C.TEAM "

    const preCard = await connection.query(preSql);
    const afterCard = await connection.query( " SELECT COUNT(*) AS COUNT FROM EMP WHERE TEAM NOT IN ( SELECT TEAM FROM EMP WHERE NAME_KOR = '장혜진' ) AND NAME_KOR = '"+receiver+"' ");
    
    try{
        if(content.length < 100) {
            res.status(400).send({message:"칭찬 내용은 100자 이상 작성해주세요. "})
            connection.release();
            return ;
        } else if (receiver == '') {
            res.status(400).send({message:" 칭찬 받을 사람을 선택해주세요. "})
            connection.release();
            return ;
        } else if(receiver == "장혜진") {
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
        } else  {
            //등록쿼리
            let sql =""
            if(seq == 0) {
                sql += "INSERT INTO PRAISE_CARD_202111 (QUARTER, RECEIVER, SENDER, SEND_DT, SEND_TM, CONTENT)   ";
                sql += "  VALUES ('2021년도 1분기', '"+receiver+"', '장혜진', DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(NOW(), '%H:%i:%s'), '" + content + "')  "
            } else {
                sql += "UPDATE PRAISE_CARD_202111 SET RECEIVER = '" + receiver + "' , SEND_DT = DATE_FORMAT(NOW(), '%Y-%m-%d'), SEND_TM=DATE_FORMAT(NOW(), '%H:%i:%s'), CONTENT='"+content+"'";
                sql += "  WHERE SEQ =  " + seq + " AND SENDER = '장혜진' "
            }
                
            const data = await connection.query(sql)
            connection.release();
            res.send({message:"제출 성공", lists: data});
        }
        
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
});


router.get('/getBestCardsQuery', async(req, res, next) => {
    try{
        let connection = await pool.getConnection(async conn => conn)
        let sql = " SELECT B.SEQ, B.RECEIVER AS BSET_RECEIVER, B.CONTENT AS BSET_CONTENT, A.QUARTER AS BSET_QUARTER  "
        sql += "   FROM (  ";
        sql += " 	        SELECT  QUARTER, MAX(EVALUATION) AS EVALUATION ";
        sql += "            FROM ( ";
        sql += "                 SELECT p.quarter AS QUARTER, SUM(c.evaluation) AS EVALUATION  ";
        sql += "                     FROM card_check c , praise_card p";
        sql += "                    WHERE c.evaluation > 0  ";
        sql += "                      AND c.seq = p.seq ";
        sql += "                    GROUP BY p.quarter,c.seq                  ) X  ";
        sql += "           GROUP BY QUARTER         ) A,  ";
        sql += "        ( ";
        sql += "            SELECT p.seq AS SEQ, p.quarter AS QUARTER, p.receiver AS RECEIVER, p.content AS CONTENT, SUM(c.evaluation) AS EVALUATION ";
        sql += "              FROM card_check  c, praise_card p    ";
        sql += "             WHERE c.evaluation > 0 AND c.seq = p.seq   ";
        sql += "             GROUP BY p.quarter,c.seq ) B, ";
        sql += "        (  SELECT quarter FROM closed WHERE isClosed = 'Y'  AND isRecClosed = 'Y' ) C  ";
        sql += "              WHERE A.EVALUATION = B.EVALUATION  AND A.QUARTER = B.QUARTER AND C.QUARTER = A.QUARTER  AND C.QUARTER = B.QUARTER "
        sql += "              ORDER BY A.QUARTER DESC ";
        const data = await connection.query(sql);
        connection.release();
        return res.json(data)
    }catch{
        return res.status(500).json()
    }
});

router.get('/getQuarterQuery', async(req, res, next) => {
    try{
        let connection = await pool.getConnection(async conn => conn)
        const data = await connection.query("SELECT * FROM CLOSED ")
        connection.release();
        return res.json(data)
    }catch (err){
        return res.status(500).json(err)
    }
});


module.exports = router;