const users = require("../controllers/userAuthController")
const products = require('../controllers/productController')
module.exports.mancollection= async function(req, res){
           const user = await users.Finduser(req) 
           let allproducts = await products.AllProducts()
           let manproducts = allproducts.filter((item)=>{
              if( item.panelcolor=='man') return true ;
           })
           if(user===null) return res.render('collection' , {cart:0 , products:manproducts,collection:"Man"})
           
            let cart = user.cart.length 
           cart===null? cart=0 : cart = user.cart.length ;     
            res.render('collection' ,{cart , products:manproducts ,collection:"Man"})
}

module.exports.womancollection = async function(req, res){
    const user = await users.Finduser(req) 
    let allproducts = await products.AllProducts()
    let womanproducts = allproducts.filter((item)=>{
       return item.panelcolor.includes('woman');
    })
    if(user===null) return res.render('collection' , {cart:0 , products:womanproducts ,collection:"Woman"})
    
     let cart = user.cart.length 
    cart===null? cart=0 : cart = user.cart.length ;     
     res.render('collection' ,{cart , products:womanproducts, collection:"Woman"})
}
module.exports.kidcollection = async function(req, res){
    const user = await users.Finduser(req) 
    let allproducts = await products.AllProducts()
    let kidproducts = allproducts.filter((item)=>{
       return item.panelcolor.includes('kid');
    })
    if(user===null) return res.render('collection' , {cart:0 , products:kidproducts ,collection:"Kid"})
    
     let cart = user.cart.length 
    cart===null? cart=0 : cart = user.cart.length ;     
     res.render('collection' ,{cart , products:kidproducts ,collection:"kid"})
}