
const mongoose = require("mongoose") 


 const messageSchema = mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId , 
        ref:'imaginist'
    } ,
    receiverId:{
        type:mongoose.Schema.Types.ObjectId , 
        ref: 'imaginist'
    } , 
    message:String , 
    vice:String , 
    versa:String , 
    readstatus:Boolean ,
    attachments:[] ,
    isdeleted:Boolean 
 })

 module.exports = mongoose.model('message',messageSchema)