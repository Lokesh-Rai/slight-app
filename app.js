const express = require('express')
const app = express()
const PORT = process.env.PORT||5000
const mongoose = require('mongoose')
const {MONGOURI} = require('./config/keys')
require("dotenv").config();



var cors = require('cors')
app.use(cors())
app.use(function (req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', ()=>{
    console.log("connected to mongo")
})
mongoose.connection.on('error', (err)=>{
    console.log("err connecting", err)
})
require('./models/user')
require('./models/post')

app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/post'))

if(process.env.NODE_ENV == "production") {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req, res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(PORT, ()=>{
    console.log("server is running on", PORT)
})