const express = require('express') ; 
const router = express.Router() ;
const {stripeUrl} = require('../controllers/checkoutController') ;


router.get('/success' , function(req, res){
    res.render('success')
})
router.get('/cancel' , function(req, res){
    res.render('cancel')
})

router.post('/stripe',stripeUrl )


module.exports = router