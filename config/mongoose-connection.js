const mongoose = require('mongoose');  
const config = require('config') ;  
const dbgr = require('debug')("development:mongoose")
const dotenv = require('dotenv') ;
const imagin = require('../models/imazinist-model');

 
dotenv.config()
mongoose.
connect(`${process.env.MONGODB_URL}/scatch`) 
.then(function(){
    console.log('DB connected')
   
})
.catch(function(err){
    console.log(err.message)
})




module.exports = mongoose.connection 