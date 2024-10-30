const productModel = require('../models/product-model') ; 
const config =  require('config')
const jwt = require('jsonwebtoken')
const users = require('../controllers/userAuthController')

module.exports.createProduct = async function(req, res){
    const {name,price ,discount ,bgcolor ,panelcolor , textcolor } = req.body 
    const image = req.file.filename
    console.log(req.file )
   try{
    await productModel.create({
        name ,
        image,
        price ,
        discount ,
        bgcolor ,
        panelcolor, 
        textcolor
      })
     
   }
   catch{
     return res.status(503).send('Something Went Wrong') ;
   }

   res.status(201).redirect('/owner/dashboard');
   
    

}

module.exports.Showproduct = async function(req ,res){
  function preffered(products , keyword ,category, gender){
    let set = new Set() ;
    let total = new Array() ;
    keyword.forEach((item) =>{
       set.add(products.filter((product)=>{if( product.textcolor.includes(item) && product.panelcolor===gender && product.bgcolor===category) return true})); 
    })
 
    set.forEach((item)=>{
      if(item.length>0){
          item.forEach((min)=>{
             total.push(min)
            
          })
      }
      else {
          total.push(item)
      }
  })
   return total
  }
      const id = req.params.id 
      const user = await users.Finduser(req) 
      let product = await productModel.findOne({_id:id})
      const products = await productModel.find() ;
      if(product==undefined || product===null){res.send('Inventory is Empty')} ;
      var data ;
      if(product.textcolor==""||product.textcolor===null) {data=product.name}else{data=product.textcolor};
      const keyword = data.split(' ');
      const interestproducts = preffered(products,keyword , product.bgcolor, product.panelcolor)
      
      let preffer = new Set() ;
      interestproducts.forEach((item)=>{if(item._id!=id){preffer.add(item)}} )
    
  
      if(user===null) return res.render('product',{cart:0 ,product:product , interest:preffer}) ;
      (user.cart.length==null)?cart=0 :cart=user.cart.length
      res.render('product',{cart, product,interest:preffer})
}

module.exports.AllProducts = async function (){
   let products = await productModel.find() ;
   return products 

 
}

module.exports.editpage = async function(req, res){
            const productId = req.params.id 

            let product = await productModel.findOne({_id:productId}) ; 
            
            if(!product) res.status(500).send("Product not found")

            res.status(200).render('editproduct' , {product}) ;   

}

module.exports.updateproduct = async function (req, res){
      const{image , name , price ,discount , bgcolor ,panelcolor ,textcolor} = req.body
      await productModel.findOneAndUpdate({_id:req.params.id} ,{image , name ,price ,discount , bgcolor ,panelcolor ,textcolor} , {new:true})
     .then(()=>{
      res.status(200).redirect(`/product/${req.params.id}`)
     }); 
}

module.exports.deleteproduct = async function(req, res){
    const productId = req.params.id ; 
    await productModel.findOneAndDelete({_id:productId}).then(()=>{
      res.status(200).redirect('/owner/dashboard') ;
    })
    .catch((e)=>{
      res.json(e)
    })
}

module.exports.searching = async function(req, res){
          try{
            const query = req.params.query ;
            const collection = req.body.gender.split(' ') ;
            const products = await productModel.find({$or:[{name:{$regex:query, $options: "i" } },{textcolor:{$regex:query,$options:"i"}} ,{panelcolor:{$regex:query,$options:"i"}} ]}).where("panelcolor").in(collection).limit(7) 
            res.json(products);
          }
          catch(err){
           res.status(500).json({error:err.message})
          }
               
}
module.exports.category = async function(req, res){
        try{
            const collection = req.get("collection")
            
            const type = req.params.type ;
            const products = await productModel.find({bgcolor:type}).where("panelcolor").in([collection])
            res.status(200).json(products)
        }
        catch(err){
          res.status(500).json({error:err.message})
        }
}

module.exports.pricefilter = async function(req ,res){

  try{
       const maxprice = req.params.price; 
       const collection = req.get("collection") ;
       const category = req.get("category"); 
       const filter = {price:{$gte:0 , $lte:maxprice}}
       if(category==='null'){}else{filter.bgcolor=category} ;

       const products = await productModel.find(filter).where("panelcolor").in([collection]); 

       res.status(200).json(products)
  }
  catch(err){
    res.status(500).json({error:err.message})
  }
}
module.exports.colorfilter = async function(req, res){
        try{
           const color = req.params.color ;
           const category = req.get("category"); 
           const maxprice = req.get("balance") ;
           const collection = req.get("collection"); 
           
           const filter = {
            $or:[{name:{$regex:color,$options:"i"}},{textcolor:{$regex:color,$options:"i"}}],
            price:{$gte:0,$lte:maxprice},
          }
          
          if(category!=='null'){filter.bgcolor=category}; 
          const products = await productModel.find(filter).where("panelcolor").in([collection]); 
        
          res.status(200).json(products)

        }
        catch(err){
          res.status(500).json({error:"Internal server is not working"})
        }
}

