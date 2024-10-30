const userModel = require('../models/user-model'); 
const jwt = require('jsonwebtoken') ; 

const dotenv = require('dotenv')
dotenv.config() ;

module.exports.isAuthorizedUser = async function(req, res ,next){

    const token = req.cookies.ronss ; 
 

    if(token ==="" || token===undefined) 
    {
      
      req.flash('error_msg','You have to Log in First');
     return res.status(502).redirect('/user/registration') ; 
    } 
    
    else {
      try{
        var tokenuser = jwt.verify(token,process.env.JWT_KEY); 
     }
     catch{
       return   res.status(502).redirect('/user/registration')
     }
 
     const user = await userModel.findOne({ email: tokenuser.email});
     if(!user) res.status(502).redirect('/user/registration') ; 
    else {
        req.user = tokenuser ;
    }
    }
   next(); 

} 
