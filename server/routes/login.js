const express = require('express');
const router = express.Router();
const passport = require('passport');
const axios = require('axios');

router.get('/isLogin', async (req, res, next) => {
  try{
    if(req.user === undefined) {
      res.redirect('/auth/login/google')
    } else {
      res.json({'loginUser' : req.user.loginUser, 'quarterInfo' : req.user.quarterInfo})
    }
  }catch(err) {
    res.json(null)
  }
})


// status == 200
// status == 403 
router.get('/isAuthenticated', async(req, res, next) => {
  try{
    const { token } = req.query;
    req.session.passport.user.request_token = token;

    console.log(`request token : ${req.user.request_token}`)

    if(token != req.user.loginUser.ACCESS_TOKEN) {
      return res.json({result : false, message : '자동 로그아웃 되었습니다.'})
    } else if(req.isAuthenticated()) {
        const { data } = await axios({
          method : 'POST',
          url : "https://www.googleapis.com/oauth2/v1/tokeninfo",
          headers:{
            'content-type':'application/x-www-form-urlencoded;charset=utf-8'
          },
          params:{
            grant_type: 'authorization_code',//특정 스트링
            client_id:"346544479744-khv0riu09o6pr3sm55hlh5i14fmeggmf.apps.googleusercontent.com",
            client_secret:"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",
            access_token : req.user.loginUser.ACCESS_TOKEN,
          }
        });

        console.log(`isAuthenticated2 : ${JSON.stringify(data)}`)

        if(data.expires_in <= 1800 && data.expires_in > 0 ) {
          return res.json({result : true, message : '30분 후에 자동 로그아웃 됩니다. 연장하시겠습니까 ?'})
        } else if(data.expires_in <= 0) {
          return res.json({result : false, message : '자동 로그아웃 되었습니다.'})
        } else {
          return res.json({result : true, message : null})
        }
    } 
  }catch(err) {
      return res.json({result : false, message : `처리 도중 오류가 발생하였습니다. ${err}`})
  }
});

router.get('/logout', async(req, res, next) => {
  try{
    req.logout();
    if(req.user == undefined) {
      res.json();
    }  else {
      res.json(500);
    }
  }catch (error) {
    console.log(error)
  }
  
})

// ACCESS_TOKEN 자동갱신하기.
router.post('/refreshToken', async(req, res, next) => {
  try{
    const oriToken = req.user.loginUser.ACCESS_TOKEN;
    const { data } = await axios({
      method : 'POST',
      url : "https://www.googleapis.com/oauth2/v4/token",
      headers:{
        'content-type':'application/x-www-form-urlencoded;charset=utf-8'
      },
      params:{
        grant_type: 'refresh_token',//특정 스트링
        client_id:"346544479744-khv0riu09o6pr3sm55hlh5i14fmeggmf.apps.googleusercontent.com",
        client_secret:"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",
        refresh_token : req.user.REFRESH_TOKEN,
        redirect_url   : 'http://127.0.0.1:3001/auth/google/callback'
      }
    });
    
    req.session.passport.user.loginUser.ACCESS_TOKEN = data.access_token;
    req.session.passport.user.expires_in = data.expires_in;

    if(oriToken == req.user.loginUser.ACCESS_TOKEN) {
      res.status(403).json({access_token : oriToken, message : '세션 연장 실패'})
    } else {
      res.json({access_token : req.user.loginUser.ACCESS_TOKEN, message : '세션 연장 성공'})
    }

  }catch(err) {
    console.log(err)
  }
});

// 로그인 하기.
router.all('/login/google', 
  passport.authenticate('google', { 
      scope: ['email', 'profile'], 
      accessType: 'offline', 
      prompt : 'consent' 
    }), function(req, res) {
        res.header("Access-Control-Allow-Origin", "*")
        console.log("/auth/google호출")
  }
);

// 로그인 콜백함수
router.get("/google/callback", (req, res, next) => {
  try{
      passport.authenticate("google", { failureRedirect : 'https://www.google.com' }, async (error, user) => {
        req.logIn(user, function(err) {
          res.redirect("/view/list")
        })
      })(req, res, next);
  }catch(err) {
    console.log(`callback function : ${err}`)
  }
});




module.exports = router;