 const ownerModel = require('../models/owner-model')
 const bcrypt = require('bcrypt') ; 
 const jwt = require('jsonwebtoken')
 const config = require('config'); 
 const dotenv = require('dotenv')
 dotenv.config(); 
 const product = require('../controllers/productController')

 
 
 module.exports.SignUp =  async function(req,res){
    const {fullname, email ,password} = req.body; 
    const owners = await ownerModel.find() ;
    if(owners.length>0){
        res.status(503).send('You are not permitted')
    }
    else {
         
        bcrypt.genSalt(10 , function(err,salt){
            bcrypt.hash(password , salt, async function(err,hash){
               var user =  await ownerModel.create({
                    fullname: fullname  ,
                    email: email , 
                    password: hash
                 }); 
            })
        })
        const token = jwt.sign({email:email , id: user._id},process.env.JWT_KEY)
        res.status(201).cookie("ronss", token).redirect('/owner/dashboard') 
    }

}

module.exports.Login = async function(req,res){
    const {email, password} = req.body  ; 

    const user  = await ownerModel.findOne({email}); 

    if(!user) res.status(503).send('something went wrong') ; 
    else {
        bcrypt.compare(password , user.password , function(req, result){
            if(result){
                const token = jwt.sign({email:email} , process.env.JWT_KEY); 
                res.status(200).cookie("ronss",token).redirect('/owner/dashboard'); 
            }
            else {
                res.status(503).send('something went Wrong')
            }
        })
    }
}

module.exports.Logout = async function(req,res){
     const token = req.cookies.ronss
     if(token !== ""){
          res.cookie("ronss" , "").redirect('/owner') 
     }
}

module.exports.Dashboard = async function (req ,res){
    let products = await product.AllProducts() ; 

    res.status(200).render('dashboard', {products:products}) ;
}


