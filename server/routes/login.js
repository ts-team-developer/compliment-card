const express  = require('express');
var router   = express.Router();
var passport = require('passport');
const pool = require('../config/pool')

router.get('/isAuthenticated', async (req, res, next) => {
  try{
    if(req.user === undefined) {
      res.json(null)
    } else {
     
      res.json(req.user)
    }
    console.log("req.user "+JSON.stringify(req.user))
  }catch(err) {
    res.json(null)
  }
})




router.all('/login/google', 
  passport.authenticate('google', { scope: ['email', 'profile'] }), function(req, res) {
    res.header("Access-Control-Allow-Origin", "*")
    console.log("/auth/google호출")
  }
);



router.get("/google/callback", (req, res, next) => {
  try{
      passport.authenticate("google", { failureRedirect : '/login' }, async (error, user) => {
        req.logIn(user, function(err) {
          res.redirect("/view/list")
        })
      })(req, res, next);
  }catch(err) {
    console.log(err)
  }
});




module.exports = router;