const mongoose = require('mongoose'); 

const PostSchema = mongoose.Schema({
        referid:{
            type: mongoose.Schema.Types.ObjectId ,
            ref:'imaginist'
        }, 
        story:String , 
        photo:{
            type:mongoose.Schema.Types.ObjectId , 
            ref: 'product'
        } , 
        reactions:[{
            type:mongoose.Schema.Types.ObjectId , 
            ref: 'imaginist'
        }],  
        reviews:[
           {
              type:mongoose.Schema.Types.ObjectId , 
              ref:'review'
           }
        ] , 
        share:[
            {
                type:mongoose.Schema.Types.ObjectId , 
                ref: 'imaginist'
            }
        ] , 
        images:[
            {
              type:String , 
            }
        ] , 
        videos:[
            {
                type:String, 
            }
        ]

        


})

module.exports=mongoose.model('imaginistpost', PostSchema)
