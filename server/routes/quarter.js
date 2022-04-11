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

// 가장 최근 분기 조회
router.get('/recently', async(req, res, next) => {
    try{
        if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
            let connection = await pool.getConnection(async conn => conn)
            const data = await connection.query("SELECT QUARTER, ISCLOSED, ISRECCLOSED FROM CLOSED  ORDER BY QUARTER DESC LIMIT 0, 1  ")
            connection.release();
            return res.json(data)
        }

    }catch (err){
        return res.status(500).json(err)
    }
});


// 분기 전체 조회
router.get('/list', async(req, res, next) => {
    try{
        if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else {
            let connection = await pool.getConnection(async conn => conn)
            let sql = `SELECT * FROM CLOSED `;

            if(req.query.sort=='Y'){
                sql+= `ORDER BY QUARTER DESC`
            }

            const data = await connection.query(sql)
            connection.release();
            return res.json(data)
        }
    }catch (err){
        console.log(`quarter list : ${err}`)
        return res.status(500).json(err)
    }
});

// 분기(YYYY년) 전체 조회
router.get('/listOfYear', async(req, res, next) => {
    try{
        if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else {
            let connection = await pool.getConnection(async conn => conn)
            let sql = `SELECT DISTINCT LEFT(QUARTER,7) AS QUARTER FROM CLOSED `;

            if(req.query.sort=='Y'){
                sql+= `ORDER BY QUARTER DESC`
            }

            const data = await connection.query(sql)
            connection.release();
            return res.json(data)
        }
    }catch (err){
        console.log(`quarter list : ${err}`)
        return res.status(500).json(err)
    }
});

router.get('/detail', async(req, res, next) => {
    try{
        if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else {
            let connection = await pool.getConnection(async conn => conn);

            const data = await connection.query(`SELECT * FROM CLOSED WHERE QUARTER = '${req.user.quarterInfo.QUARTER}'  `)
            connection.release();
            return res.json(data)
        }

    }catch (err){
        console.log(err)
        return res.status(500).json(err)
    }
});

router.get('/getQuarterList', async(req, res, next) => {
    try{
		if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
			const {year, quarter} = req.query;

			let addWhere = "";

			if (year != 0) addWhere = "and quarter like '" + year + "%'";
			if (quarter != 0) addWhere += " and quarter like '%" + quarter + "%'";

			let connection = await pool.getConnection(async conn => conn)
			const data = await connection.query("select c.quarter, case when c.isClosed = 'Y' then 'O' else 'X' end isClosed, " +
			"case when c.isRecClosed = 'Y' then 'O' else 'X' end isRecClosed from closed c WHERE 1 = 1 " + addWhere + " order by quarter desc")
			connection.release();
			return res.json(data)
		}
    }catch (err){
      console.log(err);
        return res.status(500).json(err)
    }
});

router.get('/getYearList', async(req, res, next) => {
    try{
		if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
			let connection = await pool.getConnection(async conn => conn)
			const data = await connection.query("select left(c.quarter, 4) quarter from closed c group by left(c.quarter, 4) order by quarter desc")
			connection.release();
			return res.json(data)
		}
    }catch (err){
        return res.status(500).json(err)
    }
});

router.post('/addQuarter', async(req, res, next) => {
	if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
			let connection = await pool.getConnection(async conn => conn)

			const {quarter} = req.body;

			let sql = "INSERT INTO CLOSED (quarter, isClosed, isRecClosed) VALUES" +
			"(CONCAT(YEAR(NOW()), '년도 " + quarter + "'), 'N', 'N')";

			try{
				  const data = await connection.query(sql)
				  connection.release();
				  res.send({message:"제출 성공", lists: data});
			} catch (err) {
				console.log(err)
				return res.status(500).json(err)
			}
		}
    });

router.post('/editQuarter', async(req, res, next) => {
	if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
		  let connection = await pool.getConnection(async conn => conn)

		  const {selectedQuarter, quarter, isClosed, isRecClosed} = req.body;

		  let sql = "update closed c set quarter = concat(substring('" + selectedQuarter + "', 1,7), '" + quarter + "')" + ", isClosed = '" + isClosed +
		  "', isRecClosed = '" + isRecClosed + "' where quarter = '" + selectedQuarter + "'";

		  try{
				const data = await connection.query(sql)
				connection.release();
				res.send({message:"제출 성공", lists: data});
		  } catch (err) {
			  console.log(err)
			  return res.status(500).json(err)
		  }
		}
  });
module.exports = router;