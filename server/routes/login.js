const express  = require('express');
var router   = express.Router();
var passport = require('passport');

router.get('/isAuthenticated', async (req, res, next) => {
  try{
    
    if(req.user === undefined) {
      res.json(null)
    } else {
      console.log("21")
      res.json(req.user)
    }
  }catch(err) {
    res.json(null)
  }
})

router.all('/login', 
  passport.authenticate('google', { scope: ['email', 'profile'] }), function(req, res) {
    res.header("Access-Control-Allow-Origin", "*")
    console.log("/auth/google호출")
  }
);



router.get("/google/callback", (req, res, next) => {
  try{
      passport.authenticate("google", { failureRedirect : '/login' }, async (error, user) => {
        console.log(`google callback : ${JSON.stringify(user)}`)
        req.logIn(user, function(err) {
          res.redirect("/view/list")
        })
      })(req, res, next);
  }catch(err) {
    console.log(`callback function : ${err}`)
  }
});




module.exports = router;