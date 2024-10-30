const passport = require('passport'); 


module.exports.googleAuthenticate = passport.authenticate('google',{
    scope:['profile','email'] ,
    session:false
})

module.exports.googlecallbackURL = function(req, res){
    
 res.status(200).cookie("ronss",req.user.token).redirect('/');

}

module.exports.facebookAuthenticate = passport.authenticate('facebook',{
    scope:['public_profile','email'] ,
    session:false
})

module.exports.facebookcallbackURL = function(req, res){
    res.status(200).cookie("ronss",req.user.token).redirect('/')
}

module.exports.twitterAuthenticate = passport.authenticate('twitter',{
    session:false  
})

module.exports.twittercallbackURL= function(req, res){
    res.status(200).cookie("ronss",req.user.token).redirect('/')
}