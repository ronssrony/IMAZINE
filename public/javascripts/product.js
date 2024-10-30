        const volume = document.querySelector('.volume') ;
        const minus = document.querySelector('.volume .minus')
        const plus = document.querySelector('.volume .plus') 
        const value = document.querySelector('.volume .value')
        let price = document.querySelector('.ttlprice').innerHTML; 
        let discount = document.querySelector('.ttldiscount').innerHTML; 
        let shippingfee = document.querySelector('.ttlshipping').innerHTML ; 
        let platformfee = document.querySelector('.ttlplatform').innerHTML ;
        let pricefield = document.querySelector('.ttlprice'); 
        let discountfield = document.querySelector('.ttldiscount'); 
        let shippingfeefield = document.querySelector('.ttlshipping') ; 
        let platformfeefield = document.querySelector('.ttlplatform') ;
        plus.addEventListener('click',() => {
              var current = Number(value.innerHTML); 
              current = current + 1 ;
          
              pricefield.innerHTML = Number(price*current) ;
              discountfield.innerHTML = Math.ceil(Number(discount*current)); 
              shippingfeefield.innerHTML =Math.ceil( Number(shippingfee*current)) ;
              platformfeefield.innerHTML = Math.ceil(Number(platformfee*current)); 
              document.querySelector('.ttlfee').innerHTML = Number(pricefield.innerHTML) - Number(discountfield.innerHTML)+   Number(shippingfeefield.innerHTML) + Number(platformfeefield.innerHTML)
              value.innerHTML = current.toString().padStart(2,"0");

        } )
        minus.addEventListener('click',() => {
            var current = Number(value.innerHTML); 
            if(current<=1){
                return
            }
            current = current - 1 ;
            
            pricefield.innerHTML = Number(price*current) ;
            discountfield.innerHTML = Math.ceil(Number(discount*current)); 
            shippingfeefield.innerHTML =Math.ceil( Number(shippingfee*current)) ;
            platformfeefield.innerHTML = Math.ceil(Number(platformfee*current)); 
            document.querySelector('.ttlfee').innerHTML = Number(pricefield.innerHTML) - Number(discountfield.innerHTML)+   Number(shippingfeefield.innerHTML) + Number(platformfeefield.innerHTML)
            value.innerHTML = current.toString().padStart(2,"0");
            value.innerHTML = current.toString().padStart(2,"0") ;
           
     } )

   
document.querySelector('.checkout').addEventListener('click', function(e){
    e.preventDefault()

const products_id = document.querySelector('.productid') ;
const quantity = document.querySelector('.volume .value') 
const newArray = new Array(); 
newArray.push({id:products_id.innerHTML , quantity:quantity.innerHTML }) ;


    fetch('/checkout/stripe', {
       method: "POST" , 
       headers:{
        'Content-Type': "application/json"
       },
       body: JSON.stringify({
           items: newArray 
       })
    }).then(res =>{
       
       if(res.ok) return res.json() ;
       return res.json().then(error => {
       throw new Error(error.message)});
           
    }).then( ({url}) => {
     
    window.location = url
})
   
})




