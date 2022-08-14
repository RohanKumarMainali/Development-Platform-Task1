
// imports
const express = require('express')
const app = express();


// config

require('dotenv').config('.env')
const mongoDB = require('./config/db')
mongoDB();


// middlewares

app.use(express.json())

app.use('/api/auth',require('./routes/auth'))


// port listener
const PORT = 5000;
app.listen(5000, () =>{
    console.log(`server is running at http://localhost:${PORT}`);
})


