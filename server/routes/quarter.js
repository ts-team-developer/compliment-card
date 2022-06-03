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
            const data = await connection.query("SELECT QUARTER, ISCLOSED, ISRECCLOSED, concat(date_format(NOW(), '%Y'), '년도 ', (left(substring_index(quarter, ' ',-1),1)+1) ,'분기')  AS NEXT_QUARTER FROM CLOSED  ORDER BY QUARTER DESC LIMIT 0, 1  ")
            connection.release();
            return res.json(data)
        }

    }catch (err){
        console.log("/api/quarter/recently : " + err)
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
            // let sql = `SELECT * FROM CLOSED WHERE SUBSTRING_INDEX(QUARTER, '년도', 1) >= 2022 `;
            let sql = `SELECT * FROM CLOSED `;

          //  if(req.query.sort=='Y'){
                sql+= `ORDER BY QUARTER DESC`
           // }

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
            const data = await connection.query(` SELECT QUARTER, IF(ISCLOSED= 'Y', 1, 0) AS ISCLOSED, IF(ISRECCLOSED='Y',1,0) AS ISRECCLOSED FROM CLOSED WHERE 1 = 1 ${addWhere} ORDER BY QUARTER DESC `);
			connection.release();
			return res.json(data[0])
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

  // 유효성 체크 : 등록 시 칭찬카드 작성 시나 투표기간에는 추가 불가
  // 수정 시 :
  router.post('/save', async(req,res,next) => {
    try {
      if(req.user === undefined) {
        res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
        return ;
      } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
        res.status(403).send({message : '잘못된 접근입니다. '});
        return ;
      } else {
        let connection = await pool.getConnection(async conn => conn)
        // 분기 체크
        let selectSql = ` SELECT QUARTER FROM CLOSED WHERE QUARTER = '${req.body.QUARTER}' `;

        let insertSql = ` INSERT INTO CLOSED (QUARTER, ISCLOSED, ISRECCLOSED) VALUES  `;
        insertSql += ` ('${req.body.QUARTER}' ,'${req.body.ISCLOSED}', '${req.body.ISRECCLOSED}') `;

        let updateSql = ` UPDATE CLOSED SET ISCLOSED = '${req.body.ISCLOSED}' , ISRECCLOSED = '${req.body.ISRECCLOSED}' WHERE QUARTER = '${req.body.QUARTER}' `

        const quarterInfo = await connection.query(selectSql);

        if(quarterInfo[0].length == 0) {
            // 등록
            if(req.user.quarterInfo.ISCLOSED == 'N') {
                return res.status(400).send({message : '칭찬카드 작성기간에는 추가할 수 없습니다. '});
            } else {
                const data = await connection.query(insertSql);
                res.send({message:"저장 되었습니다.", result : data, quarter : req.body.QUARTER});
            }
        } else {
            // 수정
            const data = await connection.query(updateSql);
            res.send({message:"수정 되었습니다.", result : data, quarter : req.body.QUARTER});
        }

      }
    }catch(error) {
        console.log(error)
      res.status(500).send({message : '서버에러' + error});
    }

  });
  router.get('/view', async(req, res, next) => {
    try{
      if(req.user === undefined) {
        res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
        return ;
      } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
        res.status(403).send({message : '잘못된 접근입니다. '});
        return ;
      } else {
        let connection = await pool.getConnection(async conn => conn)
        const {QUARTER} = req.query;
        const data =  await connection.query(`SELECT QUARTER, ISCLOSED, ISRECCLOSED FROM CLOSED WHERE QUARTER = '${QUARTER} ' `);

        connection.release();
        return res.json(data[0])
      }
      }catch (err){
        console.log(err);
          return res.status(500).json(err)
      }
  });

  router.post('/save', async(req,res,next) => {
    try {
      if(req.user === undefined) {
        res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
        return ;
      } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
        res.status(403).send({message : '잘못된 접근입니다. '});
        return ;
      } else {
        let connection = await pool.getConnection(async conn => conn)
        // 분기 체크
        let selectSql = ` SELECT QUARTER FROM CLOSED WHERE QUARTER = '${req.body.QUARTER}' `;

        let insertSql = ` INSERT INTO CLOSED (QUARTER, ISCLOSED, ISRECCLOSED) VALUES  `;
        insertSql += ` ('${req.body.QUARTER}' ,'${req.body.ISCLOSED}', '${req.body.ISRECCLOSED}') `;

        let updateSql = ` UPDATE CLOSED SET ISCLOSED = '${req.body.ISCLOSED}' , ISRECCLOSED = '${req.body.ISRECCLOSED}' WHERE QUARTER = '${req.body.QUARTER}' `

        const quarterInfo = await connection.query(selectSql);

        if(quarterInfo[0].length == 0) {
            // 등록
            if(req.user.quarterInfo.ISCLOSED == 'N' || req.user.quarterInfo.ISRECCLOSED == 'N') {
                return res.status(400).send({message : '칭찬카드 작성 혹은 투표 기간에는 추가할 수 없습니다. '});
            } else {
                const data = await connection.query(insertSql);
                res.send({message:"저장 되었습니다.", result : data, quarter : req.body.QUARTER});
            }
        } else {
            // 수정
            const data = await connection.query(updateSql);
            res.send({message:"수정 되었습니다.", result : data, quarter : req.body.QUARTER});
        }

      }
    }catch(error) {
        console.log(error)
      res.status(500).send({message : '서버에러' + error});
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
      } else {

        let connection = await pool.getConnection(async conn => conn)
        const {QUARTER} = req.body;
        const data =  await connection.query(`DELETE FROM CLOSED WHERE QUARTER = '${QUARTER}' `);

        connection.release();
        res.send({message:"삭제 되었습니다.", result : data, quarter : req.body.QUARTER});
      }
      }catch (err){
        console.log(err);
          return res.status(500).json(err)
      }
  });

  // 카테고리 조회
  router.get('/category', async(req, res, next) => {
      try{
          if(req.user === undefined) {
              res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
              return ;
          } else {
              let connection = await pool.getConnection(async conn => conn)
              // let sql = `SELECT * FROM CLOSED WHERE SUBSTRING_INDEX(QUARTER, '년도', 1) >= 2022 `;
              let sql = `SELECT KEY, VALUE FROM CATEGORIES WHERE USE_YN = 'Y'`;

              const data = await connection.query(sql)
              connection.release();
              return res.json(data)
          }
      }catch (err){
          console.log(`quarter list : ${err}`)
          return res.status(500).json(err)
      }
  });
module.exports = router;
