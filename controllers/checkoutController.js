
const dotenv = require('dotenv')
const config = require('config')
dotenv.config() ;
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const productModel = require('../models/product-model')


module.exports.stripeUrl = async function(req , res){
 
    try{
        const session = await stripe.checkout.sessions.create({
             payment_method_types: ['card'], 
             mode: 'payment' , 
             
             line_items:await Promise.all (req.body.items.map(async (item) => {
                 const product = await productModel.findOne({ _id: item.id });
                 if (!product) {
                     throw new Error(`Product with ID ${item.id} not found`);
                 }
                 return {
                     price_data: {
                         currency: 'bdt',
                         product_data: {
                             name: product.name,
                         },
                         unit_amount: Number(product.price)*100 - (Number(product.discount)*100), 
                     },
                     quantity: item.quantity,
                 
                 };
             })),
             
    
             success_url:"http://localhost:3000/checkout/success" ,
             cancel_url: "http://localhost:3000/checkout/cancel" ,
         
        })
        res.json({url: session.url})
    }
    catch(e){
      res.status(500).json({error: e.message})
    }
 }