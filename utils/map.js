const { compareSync } = require("bcrypt");

function unique(products){
    let count = new Set() ; 
    let obj = new Object(null); 
    let totalprice = 0 ;
    let totaldiscount = 0 ; 
    let totalshipping = 0;  
    let totalplatform = 0;                                                
   products.forEach(element => {
    count.add(element)
    totalshipping += Math.ceil(element.price * .001); 
    totalplatform += Math.ceil(element.price *.0001 );   
    totalprice +=element.price ;
    totaldiscount +=element.discount ;
    if(obj.hasOwnProperty(element._id)){
        obj[element._id] +=1 ;
    }
    else {
        obj[element._id] = 1 ;
    }

   });
   return {obj , count , totalprice , totaldiscount, totalshipping , totalplatform}
}

module.exports = {unique}