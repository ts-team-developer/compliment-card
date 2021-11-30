const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port =process.env.PORT || 3001;
const route = require('./routes/index');

const mysql=require('mysql');
const { connect } = require('./routes/index');
const con = mysql.createConnection({
    host: '10.0.1.103',
    port: '3306',
    user : 'praise_card',
    password : 'praise_card',
    database:'praise_card'
});
const Schema = require('validate');
const { ContentCutOutlined } = require('@mui/icons-material');

const reqBodySchema = new Schema({
    "content" : {
        require : true
    },
    "receiver" : {
        require : true
    }
})
// con.connect();

app.use(cors({
    origin: [ 'http://localhost:3000'],
    credentials:true
}));
app.use(bodyParser.json());
app.use('/api', route);

app.get('/selectbody', (req,res)=> {
        con.query('select * from emp where end_date is null and work_sts = 1', function(err, rows, fields){
            if(err) {
                res.send(err)
            } else {
                res.send({emps:rows})
            }
        }),  function(err, rows, fields) {
                if(err) {
                    console.log('db fail')   
                } else {
                    console.log("db success")
                }
        };
    
})


app.get('/getQuarterQuery', (req,res)=> {
    con.query('SELECT * FROM CLOSED', function(err, rows, fields){
        if(err) {
            res.send(err)
        } else {
            res.send({lists:rows})
        }
    }),  function(err, rows, fields) {
            if(err) {
                console.log('db fail')   
            } else {
                console.log("db success")
            }
    };

});


app.get('/getCardsIWriteQuery', (req,res)=> {
    var qry = " SELECT A.SEQ, A.QUARTER, A.SENDER, A.RECEIVER, A.SEND_DT,A.SEND_TM, A.CONTENT, B.REC_FLAG, B.EVALUATION "
        qry += " FROM PRAISE_CARD_202111 A LEFT JOIN CARD_CHECK_202111 B ON A.SEQ = B.SEQ AND A.SENDER = B.NAME_KOR "
    con.query(qry , function(err, rows, fields){
        if(err) {
            res.send(err)
        } else {
            res.send({lists:rows})
        }
    }),  
    function(err, rows, fields) {
        if(err) {
            console.log('db fail')   
        } else {
            console.log("db success")
        }
    };

});

app.get('/getIsClosedQuery', (req,res)=> {
    var qry = " SELECT * FROM CLOSED WHERE QUARTER = '2021년도 2분기' "
    con.query(qry , function(err, rows, fields){
        if(err) {
            res.send(err)
        } else {
            res.send({lists:rows})
        }
    }),  function(err, rows, fields) {
        if(err) {
            console.log('db fail')   
        } else {
            console.log("db success")
        }
    };
})

// 별점주기
app.all('/doCardCheckTable', (req,res)=> {
    var qry  = "    INSERT INTO CARD_CHECK_202111 (SEQ, NAME_KOR, READ_DT, READ_TM, REC_FLAG, EVALUATION)  ";
    qry      += "    VALUES ('" + req.body.seq +  "', '장혜진', DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(NOW(), '%H%i%s'), 'N', '" + req.body.evaluation + "')  "
    qry      += " ON DUPLICATE KEY UPDATE SEQ =  '" + req.body.seq + "', NAME_KOR ='장혜진', READ_DT = DATE_FORMAT(NOW(), '%Y-%m-%d'), READ_TM = DATE_FORMAT(NOW(), '%H%i%s'), EVALUATION = '" + req.body.evaluation + "'";
    
    con.query(qry, function(err, rows, fields){
        if(err) {
            res.send(err)
        } else {
            res.send({lists:rows})
        }
    }),  function(err, rows, fields) {
            if(err) {
                console.log('db fail')   
            } else {
                console.log("db success")
            }
    };

})


app.get('/getCardsDetailQuery', (req,res)=> {
    var qry = " SELECT A.SEQ, A.QUARTER, A.SENDER, A.RECEIVER, A.SEND_DT,A.SEND_TM, A.CONTENT "
    qry += " FROM PRAISE_CARD_202111 A WHERE SEQ = " + req.query.seq
    
    con.query(qry , function(err, rows, fields){
        if(err) {
            res.send(err)
        } else {
            res.send({lists:rows})
        }
    }),  function(err, rows, fields) {
            if(err) {
                console.log('db fail')   
            } else {
                console.log("db success")
            }
    };

})

// 우수 칭찬카드
app.get('/getBestCardsQuery', (req,res)=> {
    var qry = " SELECT B.SEQ, B.RECEIVER AS BSET_RECEIVER, B.CONTENT AS BSET_CONTENT, A.QUARTER AS BSET_QUARTER  "
    qry += "   FROM (  ";
    qry += " 	        SELECT  QUARTER, MAX(EVALUATION) AS EVALUATION ";
    qry += "            FROM ( ";
    qry += "                 SELECT p.quarter AS QUARTER, SUM(c.evaluation) AS EVALUATION  ";
    qry += "                     FROM card_check c , praise_card p";
    qry += "                    WHERE c.evaluation > 0  ";
    qry += "                      AND c.seq = p.seq ";
    qry += "                    GROUP BY p.quarter,c.seq                  ) X  ";
    qry += "           GROUP BY QUARTER         ) A,  ";
    qry += "        ( ";
    qry += "            SELECT p.seq AS SEQ, p.quarter AS QUARTER, p.receiver AS RECEIVER, p.content AS CONTENT, SUM(c.evaluation) AS EVALUATION ";
    qry += "              FROM card_check  c, praise_card p    ";
    qry += "             WHERE c.evaluation > 0 AND c.seq = p.seq   ";
    qry += "             GROUP BY p.quarter,c.seq ) B, ";
    qry += "        (  SELECT quarter FROM closed WHERE isClosed = 'Y'  AND isRecClosed = 'Y' ) C  ";
    qry += "              WHERE A.EVALUATION = B.EVALUATION  AND A.QUARTER = B.QUARTER AND C.QUARTER = A.QUARTER  AND C.QUARTER = B.QUARTER "
    qry += "              ORDER BY A.QUARTER DESC ";

    con.query(qry , function(err, rows, fields){
        if(err) {
            res.send(err)
        } else {
            res.send({lists:rows})
        }
    }),  function(err, rows, fields) {
            if(err) {
                console.log('db fail')   
            } else {
                console.log("db success")
            }
    };

})

const test = (receiver) => {
    return (async (req, res, next) => {
        try {
            var sql = " SELECT COUNT(*) AS COUNT FROM PRAISE_CARD_202111 WHERE QUARTER = '2021년도 1분기' AND SENDER = '장혜진' AND RECEIVER = '" + receiver + "' ";
            con.query(sql, function(err, data, fields){
                if(err) throw err;
                count = data[0].COUNT;
                if(count > 0) {
                }
            }), function(err, rows, fields) {  
            };
            return await data[0].COUNT;
        } catch {
            return 0;
        } 
    })
}

app.post("/register", (req, res) => {
    const { seq, receiver, content } = req.body;
    var sql = " SELECT COUNT(*) AS COUNT FROM PRAISE_CARD_202111 WHERE QUARTER = '2021년도 1분기' AND SENDER = '장혜진' AND RECEIVER = '" + receiver + "' ";
    var count = 0;

   
    console.log("RWAR : "+test(receiver));
   
    if(count <= 3 && count > 0) {
        console.log(count)
    }
    
});

 //con.end();

app.listen(port, ()=>{
    console.log(`express is running on ${port}`);
})