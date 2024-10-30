const mongoose = require('mongoose') ; 


const imazinist = mongoose.Schema ({
    name:String , 
    email:String ,
    photo:String ,
    follower:[{
        type:mongoose.Schema.Types.ObjectId , 
        ref:'imaginist'
    }],
    follow:[{
        type:mongoose.Schema.Types.ObjectId , 
        ref:'imaginist'
    }] ,
    choicelist:[{
       type: mongoose.Schema.Types.ObjectId ,
       ref: "imaginist"
    }]  , 
    stories:[
        {
            type: String 
        }]
})

module.exports = mongoose.model('imaginist',imazinist) ;