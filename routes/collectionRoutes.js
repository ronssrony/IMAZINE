const express = require('express') ;
const router = express.Router() ; 
const {mancollection, womancollection, kidcollection} = require('../controllers/collectionController')

router.get('/man',mancollection)

router.get('/woman',womancollection); 

router.get('/kid',kidcollection)

module.exports = router ;