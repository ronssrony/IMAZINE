const passport = require('passport'); 
const router = require('express').Router(); 

const {googleAuthenticate ,googlecallbackURL,facebookAuthenticate, facebookcallbackURL ,twitterAuthenticate,twittercallbackURL} = require('../controllers/authController')

router.get('/google',googleAuthenticate); 

router.get('/google/redirect',passport.authenticate('google',{failureRedirect: '/user/registration' ,session: false}) ,googlecallbackURL) ;

router.get('/facebook',facebookAuthenticate)

router.get('/facebook/redirect',passport.authenticate('facebook',{failureRedirect:'/user/registration',session:false}),facebookcallbackURL) ;

router.get('/twitter',twitterAuthenticate)
router.get('/twitter/redirect',passport.authenticate('twitter', {failureRedirect:"/user/registration", session:false}),twittercallbackURL)


module.exports = router ;