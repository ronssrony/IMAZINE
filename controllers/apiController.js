
const products = require('../controllers/productController')
const jwt = require('jsonwebtoken') ; 
const bcrypt = require('bcrypt') ;
const userModel = require('../models/user-model')
const dotenv = require('dotenv'); 
dotenv.config()
const imaginistModel = require('../models/imazinist-model'); 
const imaginistPostModel = require('../models/imaginist-post-model')
const reviewModel = require('../models/imaginist-review-model');
const imaginistReviewModel = require('../models/imaginist-review-model');
const {randomize} = require('../utils/randomize')
const {snapsort}  = require("../utils/SnapSort")
const messageModel = require('../models/message-model')
const activity = require('../models/imazinActivity-model'); 
const client = require('../services/Redis');
const { JSONCookie } = require('cookie-parser');
const socket = require('../services/socketio');
const imazinActivityModel = require('../models/imazinActivity-model');
const { subscribe } = require('../routes/userRoutes');
const { query } = require('express');


const ExecSubscribe =async(id)=>{
    const Subscriber =  client.duplicate(); 
    await Subscriber.connect()
    
    await Subscriber.subscribe(id, (message)=> {
      console.log(`Received message for user ${id}:`, message);
  });
}

// async function updateExistingDocuments() {
//     try {
//         await imaginistPostModel.updateMany(
//             { images: { $exists: false } },  // Find documents without 'stories'
//             { $set: { images: [] } }, 
//             {videos:{$exists:false}} , 
//             {$set:{videos:[]}}         // Set 'stories' as an empty array
//         );
//         console.log("Existing documents updated to include 'stories' field");
//     } catch (err) {
//         console.error("Error updating existing documents:", err);
//     }
// }
 
// updateExistingDocuments()



module.exports.getallproducts = async function(req, res){
   const ProductOnRedis = await client.get('all:products'); 
   if(ProductOnRedis) return res.status(200).json(JSON.parse(ProductOnRedis))
  const allproducts = await products.AllProducts()
    await client.set('all:products',JSON.stringify(allproducts) )
    res.status(200).json(allproducts)
}

module.exports.LoginwithSocial = async function (name , email , photo){
  const user = await imaginistModel.findOne({email});
           
  if(user){
      const token = jwt.sign({email: user.email} , `${process.env.JWT_KEY}`);  
      user.token = token ;
      return user 
     }  

   else {
   const user = await imaginistModel.create({
      email: email,
      name: name,
      photo:photo
       });
     const token = jwt.sign({email: user.email} , `${process.env.JWT_KEY}`);  
     user.token = token ;
     return user 
   }  
}

module.exports.snapLogin= async function (req, res){
  const  user = jwt.verify(req.cookies.ronss , process.env.JWT_KEY)
  const imaginist = await imaginistModel.findOne({email:user.email}) ;
  res.status(200).json({ imazinistId: imaginist._id });

 
}
module.exports.imaginistLogin = async function(req, res) {
   
  const { email, password } = req.body;
 
  
  try {
      const user = await userModel.findOne({ email });
      if (!user) throw new Error('The Email is invalid. Please sign in.');
      const result = await bcrypt.compare(password, user.password);
      if (result) {
          let token = jwt.sign({ email }, process.env.JWT_KEY);
          
          let imazinistuser = await imaginistModel.findOne({ email });
          if (!imazinistuser) {
              imazinistuser = await imaginistModel.create({
                  email: user.email,
                  name: user.fullname,
              });
          }
        
          res.cookie("ronss", token, {
              httpOnly: true,
              secure: true,
              sameSite: 'None',
          });
        
          res.status(200).json({ imazinistId: imazinistuser._id });
        
          ExecSubscribe(`${imazinistuser._id}`); 
      } else {
          throw new Error('The Email or password is invalid. Please sign in.');
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};


 
module.exports.choicelist = async function(req, res){
   

  try{
    const  user = jwt.verify(req.cookies.ronss , process.env.JWT_KEY)
    const validone = await userModel.findOne({email:user.email});

    if(!validone) return res.status(404).json({message:"the user is not valid"})
    const imaginist = await imaginistModel.findOne({email:user.email}) ;
  
   
    if(imaginist){
      if(imaginist.choicelist.includes(req.params.id))
        {
          return res.status(200).json({message:'The product is already in your choicelist'}); 
        }

        await imaginistPostModel.create({
            referid: imaginist._id , 
            story: 'From Collection' , 
            photo: req.params.id ,

        })

        imaginist.choicelist.push(req.params.id)
         await imaginist.save(); 
          
    }
    
    res.status(200).json({message:"item has been added"})
    console.log('item added')
  }
  catch(err){
     res.status(500).json({message:"something went wrong"});
     console.log('item not added')
  }
}  

module.exports.middleware = async function(req, res){ 
       
     try{
      const tokenuser = jwt.verify(req.cookies.ronss , process.env.JWT_KEY); 
      if(tokenuser==='' || tokenuser ===undefined)
      {
        return res.status(404).json({message:"user Is not logged In"})
      }
      const user  = await imaginistModel.findOne({email:tokenuser.email}); 
      if(!user) return res.status(404).json({message:'User not logged in'})
        else {
        res.status(200).json({imazineId: user._id}); 
    }
     }
     catch(err){
      res.status(404).send(" something went wrong on the middleware controller ")
     }
}

module.exports.profile = async function(req ,res ){
  if(req.cookies.ronss===undefined || req.cookies.ronss===''){
    return res.status(200).json({message:'Login'}); 
  }

     const tokenuser = jwt.verify(req.cookies.ronss , process.env.JWT_KEY) ; 
     try{
      const profile  = await imaginistModel.findOne({email:tokenuser.email}) ; 
      let RedisProfile =await client.get(`${profile._id}`); 
      if(!RedisProfile){ 
      console.log('userfetching')
      const user = await userModel.findOne({email:tokenuser.email}) ;
      const posts = await imaginistPostModel.find().where({referid:profile._id}).populate('photo').sort({_id:-1})
      await client.set(`${profile._id}`,JSON.stringify({profile, user , posts}))
       RedisProfile = JSON.stringify({profile,user,posts})
      }
      const parsed = JSON.parse(RedisProfile)

      res.status(200).json({profile:parsed.profile , user:parsed.user , posts:parsed.posts}) 
     }
     catch(err){
      console.log(err.message)
      res.status(404).redirect('/'); 
     }
     
}
  

module.exports.updateprofile = async function(req, res){ 
  const picture = req.file.filename ;
  
  const tokenuser = jwt.verify(req.cookies.ronss , process.env.JWT_KEY)

    try{
      const user = await imaginistModel.findOneAndUpdate({email:tokenuser.email}, {photo:picture} ) 
    
    res.status(200).json({message:"Picture has been uploaded"})

    }

    catch(err){
      res.status(404).send("Something went Wrong")
    }
  
 
    
}



module.exports.Flexfeed = async function (req , res){
     try{ 
       const imaginist = await imaginistModel.find().populate('choicelist') ; 
     
       res.status(200).json({imaginist}); 
     }
     catch(err){
       res.status(404).json({message:"something went wrong"})
     }
}


module.exports.Follow = async function (req , res){
     console.log('follow')
  try{
      const user = jwt.verify(req.cookies.ronss , process.env.JWT_KEY) 
      const receiver = req.params.id
        const follower  = await imaginistModel.findOne({email:user.email}); 
        const follow = await   imaginistModel.findOne({_id:receiver})
        if(!follower.follow.includes(follow._id)){    
        follower.follow.push(follow._id); 
        console.log('addingFollow')
        await follower.save(); 
        } 
        if(!follow.follower.includes(follower._id)){
          console.log('addingFollower')
          follow.follower.push(follower._id); 
         await follow.save(); 
        }

        res.status(200).json({message:`Following ${follow.name}`})
      }
      catch(err){
        res.status(404).json({message:"something wrong"})
      }
}
  
module.exports.Unfollow =  async function (req , res){
  try{
      const user = jwt.verify(req.cookies.ronss , process.env.JWT_KEY) 
      const receiver = req.params.id
        const follower  = await imaginistModel.findOne({email:user.email}); 
        const follow = await   imaginistModel.findOne({_id:receiver})
        console.log('fromUnfoloow' , follower , follow)
        if(follower.follow.includes(follow._id)){   
        const ind =   follower.follow.indexOf(follow._id); 
        follower.follow.splice(ind, 1); 
        await follower.save(); 
        }        
        if(follow.follower.includes(follower._id)){   
        const ind =   follow.follower.indexOf(follower._id); 
          follow.follower.splice(ind,1); 
          await follow.save();   
        } 

        res.status(200).json({message:`unFollowing ${follow.name}`})
        console.log('unfollow')
      }
      catch(err){
        res.status(404).json({message:"something wrong"})
      }
}

module.exports.myfollowers = async function (req ,res){
  try{
    const tokenuser = jwt.verify(req.cookies.ronss , process.env.JWT_KEY) ; 
    const user = await imaginistModel.findOne({email:tokenuser.email}) ; 
    res.status(200).json(user.follow) ;
  }
  catch(err){
    res.status(404).json({meassage:"something wrong"})
  }
} 


module.exports.Postfeed = async function ( req , res) {
  console.log('calllllllllll')
    let user = null ;
      if(!req.cookies.ronss){
          user = null;    
      }
      let RedisPost = await client.get("all:posts")
      let RedisDesigner = await client.get("all:designer") 
    
      if(!RedisDesigner) {
          const designers =  await imaginistModel.find().exec();
          snapsort(designers) 
          client.set('all:designer',JSON.stringify(designers))
          RedisDesigner = JSON.stringify(designers)
      }
         
      try{
        const tokenuser  = jwt.verify(req.cookies.ronss , process.env.JWT_KEY); 
        user =  await imaginistModel.findOne({email:tokenuser.email})
        const RedisMQ = await client.lLen(`message:${user._id}`) 
        if(!RedisPost) {
           const posts = await imaginistPostModel.find().populate('photo').populate('referid').exec();
           client.set('all:posts', JSON.stringify(posts)); 
           RedisPost = JSON.stringify(posts)
        }
        randomize(JSON.parse(RedisPost))

        res.status(200).json({posts:JSON.parse(RedisPost) , mq:RedisMQ , user:user , designer:JSON.parse(RedisDesigner)})
      }
       
      catch(err){
        console.log(err.message)
        if(!RedisPost) {
           const posts = await imaginistPostModel.find().populate('photo').populate('referid').exec();
           randomize(posts)
           client.set('all:posts', JSON.stringify(posts)); 
           RedisPost = JSON.stringify(posts)
        }
        res.status(200).json({posts:JSON.parse(RedisPost) , user:user , designer:JSON.parse(RedisDesigner)})
      }
      
} 

module.exports.dope = async function(req ,res){
  if(req.cookies.ronss===undefined || req.cookies.ronss===''){
    return res.status(200).json({message:'Login'}); 
  }
     try{
      const tokenuser = jwt.verify(req.cookies.ronss , process.env.JWT_KEY) ; 
      const imaginist = await imaginistModel.findOne({email:tokenuser.email}) ; 
      const post = await imaginistPostModel.findOne({_id:req.params.postid}); 
     
      if(!post.reactions.includes(imaginist._id))
      {
        post.reactions.push(imaginist._id) ;
        await post.save(); 
        await client.del('all:posts') ;
      }  
      res.status(200).json({message:'Dope Added'})
     }
     catch(err){
      res.status(404).json({message:'Something error in dope/:postid controller'})
     }
}
module.exports.undope = async function(req ,res){
  if(req.cookies.ronss===undefined || req.cookies.ronss===''){
    return res.status(200).json({message:'Login'}); 
  }
     try{
      const tokenuser = jwt.verify(req.cookies.ronss , process.env.JWT_KEY) ; 
      const imaginist = await imaginistModel.findOne({email:tokenuser.email}) ; 
      const post = await imaginistPostModel.findOne({_id:req.params.postid}); 
     
      if(post.reactions.includes(imaginist._id))
      {
        const ind = post.reactions.indexOf(imaginist._id); 
        post.reactions.splice(ind,1) ;
        await post.save(); 
        await client.del('all:posts') ;
      }
      res.status(200).json({message:'UnDoped'})
     }
     catch(err){
      res.status(404).json({message:'Something error in dope/:postid controller'})
     }
}


module.exports.createreview = async function(req ,res){
  if(req.cookies.ronss===undefined || req.cookies.ronss===''){
    return res.status(200).json({message:'Login'});   
  }
     try{
      const tokenuser = jwt.verify(req.cookies.ronss , process.env.JWT_KEY) ; 
      const imaginist = await imaginistModel.findOne({email:tokenuser.email}) ; 
      const postid = req.params.postid; 
      const content = req.body.review ;
      await  reviewModel.create({
        referid:imaginist._id , 
        postid: postid , 
        content: content 
      })
      
      const reviews =await imaginistReviewModel.find().where({postid:postid}).populate('referid').sort({createdAt:-1}) ; 

        res.status(200).json(reviews)
      
     }
     catch(err){
      res.status(404).json({message:err.message})
     }
}  

module.exports.fetchReview = async function(req, res){

     try{
      const postid = req.params.postid; 
      const reviews = await imaginistReviewModel.find().where({postid:postid}).populate('referid').sort({createdAt:-1}); 
      res.status(200).json(reviews)
 
     }    
     catch(err){
      res.status(404).json({message:err.message})
     }
} 
 
module.exports.logout = async function(req , res){
  if(req.cookies.ronss === null || req.cookies.ronss===''){
   return res.status(404).json({message:"something wrong on mymessage controller"})
  }

  try{
    const tokenuser = jwt.verify(req.cookies.ronss , process.env.JWT_KEY); 
    const user = await imaginistModel.findOne({email:tokenuser.email})
   const status = await activity.findOne({userId:user._id}).sort({createdAt:-1})
   status.active = false ;
   await status.save() 

    res.cookie("ronss",'', { httpOnly: true,
      secure:true ,
        sameSite: 'None',}
      )
      console.log('logout')

    res.status(200).json({status:user})
  }
  catch(err){
    res.status(404).json({message:"something wrong on mymessage controller"})
  }
     
  
}



module.exports.Viewprofile = async  function(req , res){
    const userid = req.params.userid
   
      const user = await imaginistModel.findOne({_id:userid}).exec();  
      const posts = await imaginistPostModel.find().where({referid:userid}).populate('photo')
      res.status(200).json({profile:user , user:user , posts:posts}) 
     
   
}

module.exports.mymessages = async function(req ,res){
  if(req.cookies.ronss === null || req.cookies.ronss===''){
   return  res.status(404).json({message:"something wrong on mymessage controller"})
  }

  try{
    const tokenuser = jwt.verify(req.cookies.ronss , process.env.JWT_KEY); 
    const user = await imaginistModel.findOne({email:tokenuser.email}).populate('choicelist'); 

    res.status(200).json({chatlist:user.choicelist})
  }
  catch(err){
    res.status(404).json({message:"something wrong on mymessage controller"})
  }  
}     
module.exports.fetchuserid = async function(req ,res){
  if(req.cookies.ronss === null || req.cookies.ronss===''){
   return res.status(404).json({message:"something wrong on mymessage controller"})
  }   
  try{
    const tokenuser = jwt.verify(req.cookies.ronss , process.env.JWT_KEY); 
    const user = await imaginistModel.findOne({email:tokenuser.email}); 
    res.status(200).json({message:user._id , user:user})
  }
  catch(err){
    res.status(500).json({message:"something wrong on mymessage controller"})
  }  
}    
    
module.exports.Chatpeople = async function (req , res){ 
      try{
        const user = await imaginistModel.findOne({_id:req.params.id}).exec(); 
        console.log('chatppeopleHited')
        res.status(200).json(user)
      
      }
      catch(err){
       
        res.status(404).json({message:"something wrong on Chatpeople controller"})
      }
}

module.exports.receiverprofile = async  function(req , res){
    try{
      const userid = req.params.userid
      const user = await imaginistModel.findOne({_id:userid}).exec();  
      res.status(200).json({ user:user }) 
  
    }
    catch(err){
      res.status(404).json({message:"something wrong on receiverprofile controller"})
    }
}
  
module.exports.Message = async function (req ,res){
       const sender = await imaginistModel.findOne({_id:req.body.senderId});
       const receiver  = await imaginistModel.findOne({_id:req.body.receiverId}); 
       if(!sender.choicelist.includes(receiver._id)){ sender.choicelist.push(receiver._id) ; await sender.save()} ; 
       if(!receiver.choicelist.includes(sender._id)){receiver.choicelist.push(sender._id) ; await receiver.save()}; 

     const mesg =  await messageModel.create({ 
          senderId:req.body.senderId , 
          receiverId:req.body.receiverId, 
          message:req.body.message ,
          readstatus: false  ,
          isdeleted: false  , 
          vice:req.body.senderId+req.body.receiverId ,
    
       })
   const NotiyReciver = await imazinActivityModel.findOne({userId:receiver._id}).sort({createdAt:-1});
    if(!NotiyReciver.active){
      const io = socket.getIO(); 
     await client.lPush(`message:${receiver._id}` , JSON.stringify(mesg)); 
    }
   else { await client.publish(`${receiver._id}`, JSON.stringify(mesg)) }

    res.status(200).json({message:'Message is Successfuly sent'})
}   
module.exports.Receivemessage = async function (req ,res){``
 
 
  var messages = await messageModel.find().where({$or:
    [
     {vice:req.body.senderId+req.body.receiverId},
    {vice:req.body.receiverId+req.body.senderId}
   ]})
    
  res.status(200).json({message:messages})

  
}   

module.exports.Activestatus = async function(req ,res ){
   
        const  user = await activity.findOne({userId:req.params.userid}).sort({createdAt:-1})
        res.status(200).json({status:user})
      
}

module.exports.UploadStories = async function(req, res){
   const picture = req.file.filename
    
   try{
    const token = jwt.verify(req.cookies.ronss , process.env.JWT_KEY)
    const user =await imaginistModel.findOne({email:token.email});
    await client.del(`${user._id}`) ; 
    user.stories.push(picture);   
    await user.save() ;
    
    res.status(200).json({message:picture})  
   }  
   catch(err){
    res.status(200).json({message:err})
   } 
   }  


   module.exports.CreatePost = async function(req ,res){
  
    if(req.cookies.ronss === undefined || req.cookies.ronss==='')
    {
      return res.status(400).json({message:'you are not logged in'})
    }
     await client.del('all:posts') ;
  
      const token = jwt.verify(req.cookies.ronss , process.env.JWT_KEY); 
      let images  = null ; 
      let video = null ;
      if(req.files['postimage']) images = req.files['postimage'].map((file)=> file.filename)
      if(req.files['video']) video = req.files['video'].map((file)=>file.filename)
        const imaginist = await imaginistModel.findOne({email:token.email}); 
      await client.del(`${imaginist._id}`) ; 
      const post = await imaginistPostModel.create({
          referid:imaginist._id , 
          story: req.body.story ,
          images: images ,
          videos: video , 

      })
      res.status(200).json({post:post})     
   }

   module.exports.DeletePost = async function (req , res ){
       const {referid} = req.query ;
  
          try{ 
            await client.del('all:posts') ;
            await client.del(`${referid}`) ; 
            await imaginistPostModel.findOneAndDelete({_id:req.params.postid}).exec() 
            res.status(200).json({message:"Post Has Been Deleted"})
          }
          catch(err){
            res.status(400).json({message:"Something went wrong"}); 
          }
   }

   module.exports.myNotification = async function(req , res){
    const {myid} = req.params ;
    console.log(myid)
    const notify = await client.lLen(`message:${myid}`)
    if(notify) return res.status(200).json({notify})
      else return res.status(500).json({mesg:'user not log in'})
   }

   module.exports.MessageNotify = async(req,res) =>{
        const{myId} = req.params ;
        console.log(myId) ;
      try{
        const notify  = await client.del(`message:${myId}`)
        res.status(200).json({message:'mEssage NOtication Deleted'})
      }
      catch(err){
        res.status(404).json({message:err.message})
      }
   }