const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser  = require('cookie-parser');
const passport = require('passport');
const path = require('path');
const passportConfig = require('./config/passport')
require('dotenv').config();

const port = process.env.PORT;

app.use(cookieParser());
app.use("/view",express.static(path.join(__dirname, '..', 'build')));

app.get("/view", function (req, res) {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});


app.use(cors({
    origin: true,
    credentials:true
}));

app.use(bodyParser.json());

app.use(session({ 
    secret:'MySecret', 
    resave: true, 
    saveUninitialized:true,
    cookie : {
        httpOnly :true
    }
}));

// Passport setting
app.use(passport.initialize()); // passport구동
app.use(passport.session()); // session 연결

passportConfig()


// router
app.use('/api', require('./routes'));
app.use('/auth', require('./routes/login'));


app.get("/view/*", function (req, res) {
    if(req.user === undefined) {
        res.redirect('/auth/login/google');
    } else {
        res.sendFile(path.join(__dirname, '../build/index.html'));
    }
});


app.use(function(req, res, next) {
    const err = new Error("NOT Found");
    err.status = 404;
    if(req.user === undefined) {
        res.redirect('/auth/login/google')
    } else {
        res.redirect('/view/list')
    }
    // next(err);
});

app.use(function(err, req, res, next) {
    console.log('err test ' + err.status)
    // res.redirect("/view/notFound")
});

const http = require('http').createServer(app);
http.listen(port, ()=>{
    console.log(`express is running on ${port}`);
})