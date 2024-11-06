const passport = require('passport'); 


module.exports.googleAuthenticate = passport.authenticate('google',{
    scope:['profile','email'] ,
    session:false
})

module.exports.googlecallbackURL = function(req, res){

 res.cookie("ronss",req.user.token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
});

res.status(200).redirect(`https://imazine.netlify.app`);

}

module.exports.facebookAuthenticate = passport.authenticate('facebook',{
    scope:['public_profile','email'] ,
    session:false
})

module.exports.facebookcallbackURL = function(req, res){
    res.cookie("ronss",req.user.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    });
    
    res.status(200).redirect(`https://imazine.netlify.app`);
    
}

module.exports.twitterAuthenticate = passport.authenticate('twitter',{
    session:false  
})

module.exports.twittercallbackURL= function(req, res){
    res.status(200).cookie("ronss",req.user.token).redirect('/')
}