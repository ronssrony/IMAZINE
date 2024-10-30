const mongoose = require('mongoose') 

const activitySchema = mongoose.Schema({
    active:Boolean , 
    userId:{
        type:mongoose.Schema.Types.ObjectId , 
        ref:'imaginist'
    }
} ,{timestamps:true})  ;

module.exports = mongoose.model('activity' , activitySchema)