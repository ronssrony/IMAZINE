const express = require('express') ; 
const router = express.Router() ; 
const {getallproducts ,snapLogin, imaginistLogin ,MessageNotify, myNotification,  choicelist , middleware, profile , updateprofile ,Flexfeed, Follow , myfollowers ,Unfollow , Postfeed , dope ,undope, createreview, fetchReview, logout ,Viewprofile, mymessages ,fetchuserid, Chatpeople, receiverprofile, Message ,Receivemessage ,Activestatus  ,UploadStories , CreatePost ,DeletePost} = require('../controllers/apiController')
const upload = require('../utils/multer')


router.get('/products', getallproducts)   
router.get('/choicelist/:id',choicelist)
router.post('/login' ,imaginistLogin )
router.post('/slogin',snapLogin)
router.get('/middleware',middleware)
router.get('/profile',profile)
router.post('/profile/:id',upload.single('image'),updateprofile)

router.get('/flexfeed',Flexfeed)
router.get('/postfeed',Postfeed)
router.get('/follow/:id', Follow)
router.get('/unfollow/:id', Unfollow)
router.get('/myfollow', myfollowers)
router.get('/dope/:postid',dope)  
router.get('/undope/:postid',undope)

router.post('/review/:postid',upload.none() , createreview) ;

router.get('/reviews/:postid', fetchReview) ;
router.get('/logout',logout) ;

router.get('/viewprofile/:userid',Viewprofile)
router.get('/mymessages',mymessages)
router.get('/fetchuserid',fetchuserid)
router.get('/chatpeople/:id',Chatpeople)
router.get('/receiverprofile/:userid',receiverprofile)
router.post('/message',Message)
router.post('/receivemessage',Receivemessage)
router.get('/activestatus/:userid' , Activestatus)

router.post('/profile/stories/:id',upload.single('image'),UploadStories)

router.post('/latest/post',upload.fields([{name:'postimage', maxCount:6} ,{name:'video' , maxCount:3}]) , CreatePost)

router.delete('/post/:postid' , DeletePost)

router.get('/myNotification/:myid',myNotification)

router.get('/MessageNotify/:myId', MessageNotify)

module.exports = router  ;  