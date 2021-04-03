const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const {MONGOURI} = require('./keys')
const ejs = require('ejs')
const paypal = require('paypal-rest-sdk')

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

mongoose.connection.on('connected',()=>{
    console.log("connected to mango !")
})

mongoose.connection.on('error',(err)=>{
    console.log("error connecting to mango !",err)
})

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

app.set('view engine', 'ejs')


paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ATwHTYEC2siOZotdlcdLHvcihRiok6XWvjpBsy0OzIGzUg8TdFjeLCWfkTz9kktZrnWS0NLkkfn8QjCs',
    'client_secret': 'ECWfXsjFNsCWJRlRMUc59p4KjTmSjiaHaMTnxpQy2x1jkJqpqxeCRiqmu58LQJGTxMHLpZRiwMX0Y65h'
});

app.listen(PORT,()=> {
    console.log("server is running on", PORT)
})
