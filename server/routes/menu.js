const express  = require('express');
var router   = express.Router();
const { body, param, validationResult } = require('express-validator')
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

var validList = [
  body("MENU_ID", "메뉴 아이디는 필수 항목입니다.").not().notEmpty(),  
  body("MENU_NM", "메뉴 이름은 필수 항목입니다. ").not().notEmpty(),
  body("MENU_URL", "메뉴URL은 필수 항목입니다..").not().notEmpty(),
  body("MENU_URL").custom(value => {
    const startIdx = value.indexOf("/", 0);
    const lastIdx = value.indexOf("/", value.length-1);
    // 첫글자가 '/'가 아님
    if(startIdx == -1) {
      return Promise.reject(`메뉴URL은 '/'로 시작되어야 합니다.`);
    } else if(lastIdx == value.length-1) {
      return Promise.reject(`메뉴URL은 '/'로 끝날 수 없습니다.`);
    } else {
      return true;
    }
  })
]


router.get('/list', async(req, res, next) => {
    try{
      if(req.user === undefined) {
        return res.json(null)
      } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
        res.status(403).send({message : '잘못된 접근입니다. '});
        return ;
      } else {
        let connection = await pool.getConnection(async conn => conn)
        const data = await connection.query(`SELECT * FROM MENU A INNER JOIN ROLEMENU B ON A.MENU_ID = B.MENU_ID INNER JOIN EMP C ON B.ROLE_CD = C.AUTH WHERE C.EMAIL = '${req.user.loginUser.EMAIL}' ORDER BY ORDER_SQ`)
        connection.release();
        return res.json(data[0])
      }
    }catch (err){
        console.log(err)
        return res.status(500).json(err)
    }
});

router.get('/getMenuListAll', async(req, res, next) => {
    try{
		  if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
        const {USE_YN, MENU_NM} = req.query;

        let addWhere = "";

        if ( MENU_NM != '') addWhere = "and MENU_NM like '%" + MENU_NM + "%'";
        if ( USE_YN != 'X') addWhere = "and USE_YN = '" + USE_YN + "'";

        let connection = await pool.getConnection(async conn => conn)
        const data = await connection.query(`SELECT m.MENU_ID, m.MENU_NM, m.MENU_URL, IF(USE_YN = 'Y', 1, 0) AS USE_YN FROM MENU m WHERE 1 = 1  ${addWhere} ORDER BY USE_YN DESC , MENU_ID `)
        connection.release();
        return res.json(data[0])
		  }
    }catch (err){
      console.log(err);
        return res.status(500).json(err)
    }
});

router.post('/deleteMenu', async(req, res, next) => {
	if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
			let connection = await pool.getConnection(async conn => conn)

			const {menuIdArr} = req.body;

			let sql = "UPDATE MENU SET USE_YN = 'N' WHERE MENU_ID IN (" + menuIdArr + ")";

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

router.post('/activateMenu', async(req, res, next) => {
	if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
			let connection = await pool.getConnection(async conn => conn)

			const {menuIdArr} = req.body;

			let sql = "UPDATE MENU SET USE_YN = 'Y' WHERE MENU_ID IN (" + menuIdArr + ")";

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

router.post('/addMenu', async(req, res, next) => {
	if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
			let connection = await pool.getConnection(async conn => conn)

			const {menuId, menuNm, menuUrl} = req.body;

			let sql = "INSERT INTO MENU (SITE_TYPE, MENU_ID, MENU_NM, MENU_URL, USE_YN) VALUES ('CMAS', " +
			"'" + menuId + "', '" + menuNm + "', '" + menuUrl + "', 'Y')";

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
  router.post('/save', validList, async(req,res,next) => {
    try {
      if(req.user === undefined) {
        res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
        return ;
      } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
        res.status(403).send({message : '잘못된 접근입니다. '});
        return ;
      } else {
        const error = validationResult(req);
  
        if(!error.isEmpty()) {
          console.log(error)
          return res.status(400).json({error:error.array()})
        }
        let connection = await pool.getConnection(async conn => conn)
        // 1. 등록 시 메뉴이름 중복체크
        // 2. 등록 /수정 구분 .. MENU_ID로 조회 시 row가 없으면 등록, 있으면 수정
        
        let selectSql = ` SELECT MENU_NM, MENU_ID FROM MENU WHERE MENU_ID = '${req.body.MENU_ID}' `;
        let validSql  = ` SELECT TRIM(MENU_NM) AS MENU_NM FROM MENU WHERE MENU_NM = '${req.body.MENU_NM}' AND MENU_ID != '${req.body.MENU_ID}' `;
        let sql   = ``;
        
        const selectData = await connection.query(selectSql);
        const validData  = await connection.query(validSql);

        if(validData[0].length > 0) { 
          if(validData[0][0].MENU_NM == req.body.MENU_NM.trim()) {
            return res.status(401).send({message : '메뉴 이름은 중복될 수 없습니다. '});
          }
          if(validData[0][0].MENU_URL == req.body.MENU_URL.trim()) {
            return res.status(401).send({message : '메뉴 URL은 중복될 수 없습니다. '});
          }
        }

        if(selectData[0].length == 0) {
          // 등록
          sql = ` INSERT INTO MENU (MENU_ID, MENU_NM, USE_YN, MENU_URL, SITE_TYPE) VALUES  `;
          sql += ` ('${req.body.MENU_ID}' ,'${req.body.MENU_NM}', '${req.body.USE_YN == '1' ? 'Y' : 'N'}','${req.body.MENU_URL}', 'CMAS') ` ;
        } else {
          // 수정
          sql = ` UPDATE MENU SET MENU_NM = '${req.body.MENU_NM}' , MENU_URL='${req.body.MENU_URL}', USE_YN = '${req.body.USE_YN == '1' ? 'Y' : 'N'}' WHERE MENU_ID = '${req.body.MENU_ID}' `;
        }

        const data = await connection.query(sql);      
        res.send({message:"정상 처리 되었습니다.", result : data, menu : req.body.MENU_ID});
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
        const { MENU_ID } = req.query;
        const data =  await connection.query(`SELECT MENU_ID, MENU_NM, MENU_URL, USE_YN FROM MENU WHERE MENU_ID = '${MENU_ID}' `);

        connection.release();
        return res.json(data[0])
      }
      }catch (err){
        console.log("/api/menu/view"+err);
          return res.status(500).json(err)
      }
  });

// 가장 최근 분기 조회
router.get('/next', async(req, res, next) => {
  try{
      if(req.user === undefined) {
          res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
          return ;
      } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
          res.status(403).send({message : '잘못된 접근입니다. '});
          return ;
      } else {
          let connection = await pool.getConnection(async conn => conn)
          const data = await connection.query(" select MENU_ID, MENU_NM, USE_YN, CONCAT('MENU', LPAD(substring_index(MENU_ID, '0', -1) + 1,6,'0')) as NEXT_MENU from MENU order by MENU_ID desc limit 0, 1 ")
          connection.release();
          return res.json(data)
      }

  }catch (err){
      console.log("/api/MENU/NEXT : " + err)
      return res.status(500).json(err)
  }
});
module.exports = router;
