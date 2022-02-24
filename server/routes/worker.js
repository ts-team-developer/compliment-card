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
			const {name_kor, team} = req.query;

			let addWhere = "";

			if (team != 0) addWhere = "and team = '" + team + "'";
			if (name_kor != 0) addWhere += " and name_kor like '%" + name_kor + "%'";

			let connection = await pool.getConnection(async conn => conn)
			const data = await connection.query("SELECT e.disp_order, e.name_kor, e.team, e.rank, e.email, 'O' as work_sts FROM emp e WHERE work_sts = 1 " + addWhere)
			connection.release();
			return res.json(data)
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

router.post('/editWorker', async(req, res, next) => {
	if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
			let connection = await pool.getConnection(async conn => conn)

			const {dispOrderArr, name_kor, team, email, rank} = req.body;

			let addEditSql = "";

			if (dispOrderArr.length != 0) addEditSql = ", name_kor = '" + name_kor + "', email = '" + email + "'";

			let sql = "update emp e set team = '" + team + "', e.rank = '" + rank + "'" + addEditSql
			+ " where disp_order in (" + dispOrderArr + ")";

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

router.post('/deleteWorker', async(req, res, next) => {
	if(req.user === undefined) {
            res.status(403).send({message : '로그인 정보가 존재하지 않습니다.'});
            return ;
        } else if(req.user.request_token != req.user.loginUser.ACCESS_TOKEN) {
            res.status(403).send({message : '잘못된 접근입니다. '});
            return ;
        } else {
			let connection = await pool.getConnection(async conn => conn)

			const {dispOrderArr} = req.body;

			let sql = "UPDATE EMP SET WORK_STS = 0 WHERE DISP_ORDER IN (" + dispOrderArr + ")";

			console.log(sql);

			try{
				  //const data = await connection.query(sql)
				  //connection.release();
				  //res.send({message:"제출 성공", lists: data});
			} catch (err) {
				console.log(err)
				return res.status(500).json(err)
			}
		}
    });
module.exports = router;
