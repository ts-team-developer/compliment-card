const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser  = require('cookie-parser');
const port = process.env.PORT || 3001;
const passport = require('passport');
const path = require('path');
const passportConfig = require('./config/passport')


app.use("/view",express.static(path.join(__dirname, '..', 'build')));
app.use(cookieParser());

app.get("/", function (req, res) {
    console.log(`server.js router ==> '/' : ${req.user === undefiend}`)
    if(req.user === undefined) {
        res.redirect('/auth/login')
    } else {
        res.redirect('/view/list')
    }
})

app.get("/view", function (req, res) {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.get("/view/*", function (req, res) {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.use(cors({
    origin: true,
    credentials:true
}));

app.use(bodyParser.json());

app.use(session({ 
    secret:'MySecret', 
    resave: false, 
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

app.use(function(req, res, next) {
    res.redirect("/view/notFound")
});

app.use(function(err, req, res, next) {
    res.redirect("/view/notFound")
});

const http = require('http').createServer(app);
http.listen(port, ()=>{
    console.log(`express is running on ${port}`);
})