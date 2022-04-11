const express = require('express');
const router = express.Router();

const card = require('./card');
const quarter = require('./quarter');
const evaluation = require('./evaluation');
const emp = require('./emp');
const menu = require('./menu')
const status = require('./status')
const statistics = require('./statistics')
const worker = require('./worker')


router.use('/card', card);
router.use('/quarter', quarter);
router.use('/evalution', evaluation);
router.use('/emp', emp);
router.use('/menu', menu);
router.use('/status', status);
router.use('/statistics', statistics);
router.use('/worker', worker);
// router.use('/auth', login); -- 구글 api redirect uri오류로 로그인 부분만 통일 안함


module.exports = router;