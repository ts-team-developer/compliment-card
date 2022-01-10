const passport = require('passport');
const GoogleStrategy   = require('passport-google-oauth20').Strategy;
const pool = require('../config/pool')

pool.getConnection((err, connection) => {
    if (err) {
        switch (err.code) {
          case "PROTOCOL_CONNECTION_LOST":
            console.error("Database connection was closed.");
            break;
          case "ER_CON_COUNT_ERROR":
            console.error("Database has too many connections.");
            break;
          case "ECONNREFUSED":
            console.error("Database connection was refused.");
            break;
        }
      }
      if (connection) return connection.release();
})


// passport : 세션유지시간
// accessToken : 유효기간 , access를 갱신해주는 refreshToken 
// oauth20 : 로그인 (인증하고 권한받고),
// jwt : 
module.exports = () => {
    passport.use(new GoogleStrategy(
        {
          clientID      : "346544479744-khv0riu09o6pr3sm55hlh5i14fmeggmf.apps.googleusercontent.com",
          clientSecret  : "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",
          callbackURL   : 'http://localhost:3001/auth/google/callback',
          passReqToCallback   : true
        }, async function(request, accessToken, refreshToken, profile, done){
            try{
                let connection = await pool.getConnection(async conn => conn)
                const data = await connection.query("SELECT WORK_STS FROM EMP WHERE EMAIL ='" + profile.emails[0].value + "'")
                connection.release();
                if(data[0][0].WORK_STS == "1") {
                    console.log('test')
                    return done(null, {'uid' : profile.id, 'name' : profile.name, 'picture' : profile.photos[0].value, 'email' : profile.emails[0].value, 'token' : accessToken });
                }else {
                    console.log('test')
                    return done('fail', null)
                }
                
            }catch(err) {
                console.log(err)
                return done(err);
            }
          
        }
      ));
}