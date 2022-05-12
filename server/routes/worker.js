const express = require('express');
const router = express.Router();
const pool = require('../config/pool')

router.get('/getTeamList', async(req, res, next) => {
    try{
		if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
			let connection = await pool.getConnection(async conn => conn)
			const data = await connection.query("SELECT team FROM emp e WHERE work_sts = 1 GROUP BY team")
			connection.release();
			return res.json(data)
		}
    }catch (err){
        return res.status(500).json(err)
    }
});

router.get('/getWorkerList', async(req, res, next) => {
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
				await connection.query("SELECT e.disp_order, e.name_kor, e.team, e.rank, e.email, work_sts FROM emp e WHERE 1 = 1 " + addWhere + " order by work_sts desc ")
			connection.release();
			return res.json(data[0])
		}
    }catch (err){
      console.log(err);
        return res.status(500).json(err)
    }
});

router.post('/addWorker', async(req, res, next) => {
	if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
			let connection = await pool.getConnection(async conn => conn)

			const {name_kor, team, email, rank} = req.body;

			let sql = "INSERT INTO `emp` (`disp_order`, `team`, `name_kor`, `rank`, `class`, `work_sts`, `start_date`, `end_date`, `email`, `update_dt`, `input_id`, `isOutsourcing`) VALUES" +
			"((select max(disp_order) + 10 from emp e), '" + team + "', '" + name_kor + "', '" + rank + "', '초급', 1, NOW(), NULL, '" + email + "', NOW(), 'cmn', 0)";

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

router.post('/edit', async(req, res, next) => {
	if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
			try{
				let connection = await pool.getConnection(async conn => conn)
				const {dispOrder, col, val} = req.body;

				let sql = `UPDATE EMP E SET \`${col}\` = '${val}'  WHERE DISP_ORDER = '${dispOrder}' `
				if(col == 'work_sts') {
					sql = `UPDATE EMP SET WORK_STS = ${val ? 1 : 0 } WHERE DISP_ORDER = ${dispOrder}`;
				}
				const data = await connection.query(sql)
				connection.release();
				res.send({message:"제출 성공", lists: 1});
			} catch (err) {
				console.log(err)
				return res.status(500).json(err)
			}
		}
  });

router.post('/deleteWorker', async(req, res, next) => {
	if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
			let connection = await pool.getConnection(async conn => conn)

			const {dispOrder, work_sts} = req.body;
			console.log(`${dispOrder}, ${work_sts}`)
			
			let sql = `UPDATE EMP SET WORK_STS = ${work_sts == 1 ? 0 : 1 } WHERE DISP_ORDER = ${dispOrder}`;

			try{
				  const data = await connection.query(sql)
				  connection.release();
				  res.send({message:"제출 성공"});
			} catch (err) {
				console.log(err)
				return res.status(500).json(err)
			}
		}
    });
module.exports = router;
