
const products = document.querySelector('.products') ; 
var totalprice = document.querySelector('.ttlprice').innerHTML;
var totaldiscount = document.querySelector('.ttldiscount').innerHTML ; 
var totalshipping = document.querySelector('.ttlshipping').innerHTML; 
var platfrom = document.querySelector('.ttlplatform').innerHTML ; 
var totalfee = document.querySelector('.totalfee').innerHTML ; 


products.addEventListener('click',(item) => {
       
    if(item.target.innerHTML ==='+')
    { 

         let current = Number(item.target.previousElementSibling.innerHTML) ;
         
         current = current + 1 ;
         item.target.previousElementSibling.innerHTML = current.toString();
         
         let totalitems= Number(document.querySelector('.ttlitem').innerHTML);
         totalitems = totalitems+1;
         document.querySelector('.ttlitem').innerHTML = totalitems.toString()

         let itemprice =  (item.target.parentNode.previousElementSibling.firstElementChild.lastElementChild.firstElementChild.innerHTML )
      
         document.querySelector('.ttlprice').innerHTML = Number( document.querySelector('.ttlprice').innerHTML)+Number(itemprice) ;
        
         let discountpp = item.target.parentNode.nextElementSibling.nextElementSibling.firstElementChild.innerHTML;
         let totaldiscount = item.target.parentNode.nextElementSibling.lastElementChild.firstElementChild; 
      
         totaldiscount.innerHTML = Number(totaldiscount.innerHTML)+Number(discountpp)
         let discountbill = document.querySelector('.ttldiscount') ;
         discountbill.innerHTML = Number(discountbill.innerHTML) + Number(discountpp); 

         let totalshipping  = document.querySelector('.ttlshipping');  
         totalshipping.innerHTML = Number(totalshipping.innerHTML) + Math.ceil(Number(itemprice)* .001); 

         let totalplatform = document.querySelector('.ttlplatform'); 
         totalplatform.innerHTML = Number(totalplatform.innerHTML) + Math.ceil(Number(itemprice) * .0001)

         let totalfee = document.querySelector('.totalfee'); 
         totalfee.innerHTML =  Number(totalfee.innerHTML)+Number(itemprice) + Math.ceil(Number(itemprice) * .001) +  Math.ceil(Number(itemprice) * .0001) - Number(discountpp); 
    }
   else if(item.target.innerHTML ==='-' && item.target.nextElementSibling.innerHTML>0)

     {
          
          let current = Number(item.target.nextElementSibling.innerHTML) 
          current = current - 1 ;
          item.target.nextElementSibling.innerHTML = current.toString();
          let items= Number(document.querySelector('.ttlitem').innerHTML);
          items = items -1 ;
          document.querySelector('.ttlitem').innerHTML = items.toString()

          let itemprice =  (item.target.parentNode.previousElementSibling.firstElementChild.lastElementChild.firstElementChild.innerHTML )
      
         document.querySelector('.ttlprice').innerHTML = Number( document.querySelector('.ttlprice').innerHTML)-Number(itemprice) ;
        
         let discountpp = item.target.parentNode.nextElementSibling.nextElementSibling.firstElementChild.innerHTML;
         let totaldiscount = item.target.parentNode.nextElementSibling.lastElementChild.firstElementChild; 
         totaldiscount.innerHTML = Number(totaldiscount.innerHTML)-Number(discountpp)

         let discountbill = document.querySelector('.ttldiscount') ;
         discountbill.innerHTML = Number(discountbill.innerHTML) - Number(discountpp); 

         let totalshipping  = document.querySelector('.ttlshipping');  
         totalshipping.innerHTML = Number(totalshipping.innerHTML) - Math.ceil(Number(itemprice)*.001); 

         let totalplatform = document.querySelector('.ttlplatform'); 
         totalplatform.innerHTML = Number(totalplatform.innerHTML) - Math.ceil(Number(itemprice) *.0001)

         let totalfee = document.querySelector('.totalfee'); 
         totalfee.innerHTML =  Number(totalfee.innerHTML)-Number(itemprice) - Math.ceil(Number(itemprice) * .001) -  Math.ceil(Number(itemprice) *  .0001) + Number(discountpp)
     }

})


document.querySelector('.checkout').addEventListener('click', function(e){
     e.preventDefault()

const products_id = document.querySelectorAll('.product_id') ; 
const quantity = document.querySelectorAll('.quantity') ; 
const newArray = new Array(); 
for(let i = 0 ; i<products_id.length ; i++)
{
    newArray[i] ={id:products_id[i].innerHTML , quantity:quantity[i].innerHTML } ;
}


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

