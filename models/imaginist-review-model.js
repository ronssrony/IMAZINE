const mongoose = require('mongoose')  ; 


const reviewsSchema = mongoose.Schema({
    referid:{
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'imaginist'
    } , 
    postid:{
        type:mongoose.Schema.Types.ObjectId ,
        ref: 'imaginistpost'
    } , 
    content:String , 

},{
    timestamps: true
})


module.exports = mongoose.model('review' , reviewsSchema)