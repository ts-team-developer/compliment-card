const passport = require('passport');
const refresh = require('passport-oauth2-refresh')

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

const strategy = new GoogleStrategy(
  {
    clientID      : "346544479744-khv0riu09o6pr3sm55hlh5i14fmeggmf.apps.googleusercontent.com",
    clientSecret  : "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",
    callbackURL   : 'http://127.0.0.1:3001/auth/google/callback',
    passReqToCallback   : true
  }, async function(request, accessToken, refreshToken, profile, done){
      try{
        let queryString =  ` SELECT '${profile.id}' AS UID, '${accessToken}' AS ACCESS_TOKEN, NAME_KOR, EMAIL, WORK_STS `;
            queryString += ` FROM EMP WHERE EMAIL = '${profile.emails[0].value}' `;

        let connection = await pool.getConnection(async conn => conn);
        const data = await connection.query(queryString);
        connection.release();
        
        if(data[0][0].WORK_STS == "1") {
          return done(null, {'loginUser' : data[0][0], 'REFRESH_TOKEN' : refreshToken});
        }else {
          return done('fail', null)
        }
      }catch(err) {
        console.log(err)
        return done(err);
      }
    
  }
)
module.exports = () => {
    passport.use(strategy);
    refresh.use(strategy)
}