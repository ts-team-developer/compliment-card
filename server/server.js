const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port =process.env.PORT || 3001;
const route = require('./routes/index');

app.use(cors({
    origin: [ 'http://localhost:3000'],
    credentials:true
}));

app.use(bodyParser.json());
app.use('/api', route);


app.listen(port, ()=>{
    console.log(`express is running on ${port}`);
})