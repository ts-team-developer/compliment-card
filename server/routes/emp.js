const express = require('express');
const { body, param, validationResult } = require('express-validator')
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


var validList = [
  body("name_kor", "이름은 필수 항목입니다.").not().notEmpty(),  
  body("name_kor", "이름은 두 자 이상 입력해주세요.").trim().isLength({ min : 2 }),  
  body("rank", "직급은 필수 항목입니다.").not().notEmpty(),
  body("email", "이메일은 필수 항목입니다.").not().notEmpty(),
  body("email", "올바른 이메일 형식이 아닙니다.").isEmail(), 
  body("rank").custom(value => {
    var rankList = ["사원", "주임", "대리", "과장", "차장", "부장", "이사", "상무", "대표이사", "팀장" ];
    var count =0 ;
    for(var i =0 ; i < rankList.length; i++) {
      if(rankList[i] == value.trim()) {
        count++;
      }
    } 
    if(count == 0) {
      return Promise.reject('존재하지 않은 직급입니다. ');
    } else {
      return true;
    }
  }),
  body("team").custom(value => {
    var teamList =["캐리엠팀", "서비스팀", "솔루션사업팀", "서비스사업팀", "TS팀", "경영관리팀", "BI팀", "임원" ];
    var count =0 ;
    for(var i  =0 ; i < teamList.length; i++) {
      if(teamList[i] == value.trim()) {
        count++;
      }
    } 
    if(count == 0) {
      return Promise.reject('존재하지 않은 팀입니다. ');
    } else {
      return true;
    }
  })
]

router.get('/list', async(req, res, next) => {
    try{
        let connection = await pool.getConnection(async conn => conn)
        const data = await connection.query(`select * from emp where end_date is null and work_sts = 1 `);
        connection.release();
        return res.json(data)
    } catch (err) {
      console.log('test' + err)
        return res.status(500).json(err)
    }
});

router.get('/list/all', async(req, res, next) => {
  try{
		if(req.user === undefined) {
			res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
			return ;
		} else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
			res.status(403).send({message : '잘못된 접근입니다. '});
			return ;
		} else {
			let connection = await pool.getConnection(async conn => conn)
			let addWhere = "";
			const {name_kor, team, work_sts} = req.query;

			if (team != -1) addWhere = ` AND TEAM = '${team}' `
			if (name_kor != "") addWhere += ` AND NAME_KOR LIKE '%${name_kor}%' `
			if (work_sts != -1) addWhere += ` AND WORK_STS = '${work_sts}' `

			const data = 
				await connection.query(`SELECT e.disp_order, e.disp_order as id, e.name_kor, e.team, e.rank, e.email, work_sts, update_dt FROM emp e WHERE 1 = 1 ${addWhere} order by work_sts desc `)
			connection.release();
			return res.json(data[0])
		}
    }catch (err){
      console.log(err);
        return res.status(500).json(err)
    }
});


  router.get('/team', async(req, res, next) => {
    try{
      if(req.user === undefined) {
        res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
        return ;
      } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
        res.status(403).send({message : '잘못된 접근입니다. '});
        return ;
      } else {
        return res.json(["캐리엠팀", "서비스팀", "솔루션사업팀", "서비스사업팀", "TS팀", "경영관리팀", "BI팀", "임원" ])
      }
      }catch (err){
        console.log(err);
          return res.status(500).json(err)
      }
  });

  router.get('/rank', async(req, res, next) => {
    try{
      if(req.user === undefined) {
        res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
        return ;
      } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
        res.status(403).send({message : '잘못된 접근입니다. '});
        return ;
      } else {
        return res.json(["사원", "주임", "대리", "과장", "차장", "부장", "이사", "상무", "대표이사", "팀장" ])
      }
      }catch (err){
        console.log(err);
          return res.status(500).json(err)
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
        const {disp_order} = req.query;
        const data =  await connection.query(`SELECT disp_order, name_kor, team, \`rank\`, email, work_sts FROM EMP WHERE DISP_ORDER = '${disp_order} ' `);

        connection.release();
        return res.json(data[0])
      }
      }catch (err){
        console.log(err);
          return res.status(500).json(err)
      }
  });



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
        // 이메일 중복체크
        let selectSql = ` SELECT EMAIL FROM EMP WHERE DISP_ORDER != '${req.body.disp_order}' AND EMAIL = '${req.body.email}' `;
        const emps = await connection.query(selectSql);
    
        if(emps[0].length > 0) {
          return res.status(401).send({message : '이미 존재하는 이메일입니다. '});
        }
  
        let sql = ``;
    
        if(req.body.disp_order > 0) {
          // 수정 로직
          sql = ` UPDATE EMP SET TEAM = '${req.body.team}',   `;
          sql += ` NAME_KOR ='${req.body.name_kor}', `;
          sql += ` \`RANK\` = '${req.body.rank}', `;
          sql += ` EMAIL = '${req.body.email}', `;
          sql += ` WORK_STS = '${req.body.work_sts}' `;
          sql += `  WHERE DISP_ORDER = '${req.body.disp_order}' `;
  
          const data = await connection.query(sql)
          connection.release();
          res.send({message:"수정 되었습니다.", result : data});
  
        } else {
          // 등록 로직
          sql = ` INSERT INTO \`EMP\` ( DISP_ORDER,NAME_KOR, TEAM, \`RANK\`, EMAIL, WORK_STS, CLASS, ISOUTSOURCING, INPUT_ID, START_DATE, UPDATE_DT ) VALUES `
          sql += ` ((select max(disp_order) + 10 from emp e),'${req.body.name_kor}' ,'${req.body.team}', '${req.body.rank}', '${req.body.email}', '1' `;
          sql += ` , '', '0', 'cmn', DATE_FORMAT(now(), '%Y-%m-%d'), SYSDATE()) `
  
          const data = await connection.query(sql)
          connection.release();
          res.send({message:"저장 되었습니다.", result : data});
        }
      }
    }catch(error) {
      res.status(500).send({message : '서버에러' + error});
    }
  });

module.exports = router;