const router = require('express').Router() ;

router.get('/privacypolicy' , function(req, res){
    res.render('./partial/privacyPolicy')
})

router.get('/termsandcondition' , function(req, res){
    res.render('./partial/terms&condition')
})
module.exports = router ;