const express = require('express')
const router = express.Router(); 
const {SignUp , Login ,Logout, addTocart , Shop , Cart ,registration ,removeitem} = require('../controllers/userAuthController')
const {isAuthorizedUser} = require('../middlewares/isLoggedInUser'); 


router.post('/create' , SignUp)
router.post('/login', Login)

router.get('/shop',isAuthorizedUser ,Shop)

router.get('/logout', Logout)

router.get('/cart/:id' ,isAuthorizedUser, addTocart )

router.get('/cart' ,isAuthorizedUser, Cart); 

router.get('/registration',registration) ;

router.get('/cart/item/remove/:id',isAuthorizedUser,removeitem)

module.exports = router ;
