const express = require('express')
const router = express.Router(); 
const {SignUp , Login , Logout , Dashboard }=require('../controllers/ownerAuthController')
const { isAuthorizedOwner } = require('../middlewares/isLoggedInAdmin'); 
const config = require('config'); 
const dotenv = require('dotenv') 
dotenv.config(); 

router.get('/',function(req,res){
    res.render("owner")
})

router.post('/login' , Login)

router.get('/dashboard',isAuthorizedOwner ,Dashboard)

router.get('/logout',Logout)

if(process.env.NODE_ENV==="development"){

 router.post("/create",SignUp)  ;
  
}

router.get('/new/product', isAuthorizedOwner,function(req,res){
    res.render('newproduct')
})



module.exports = router ;