const express  = require('express');
var router   = express.Router();
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
        return res.json(null)
      } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
        res.status(403).send({message : '잘못된 접근입니다. '});
        return ;
      } else {
        let connection = await pool.getConnection(async conn => conn)
        console.log("menu : "+JSON.stringify(req.user))
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
			const {menuNm} = req.query;

			let addWhere = "";

			if (menuNm != 0) addWhere = "and MENU_NM like '%" + menuNm + "%'";

			let connection = await pool.getConnection(async conn => conn)
			const data = await connection.query("SELECT m.MENU_ID, m.MENU_NM, m.MENU_URL, case when m.USE_YN = 'Y' then 'O' else 'X' end USE_YN FROM MENU m WHERE 1 = 1 " + addWhere)
			connection.release();
			return res.json(data)
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

			console.log(sql);

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

			console.log(sql);

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

router.post('/editMenu', async(req, res, next) => {
	if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
			let connection = await pool.getConnection(async conn => conn)

			const {selectedMenuId, menuId, menuNm, menuUrl} = req.body;

			let sql = "update MENU m set MENU_NM = '" + menuNm
			+ "', MENU_URL = '" + menuUrl + "', m.MENU_ID = '" + menuId + "'"
			+ " where MENU_ID in ('" + selectedMenuId + "')";

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
