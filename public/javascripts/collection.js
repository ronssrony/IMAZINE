

if(window.innerWidth<630)
{   
  
    let startY = 0 ; 
    let endY = 0 ;
    const searchwala = document.querySelector('.searchwala') ;
    const infowala = document.querySelector('.infowala'); 

    document.addEventListener('touchstart', function(item){
        startY = item.touches[0].clientY ;
    
   
    })
    document.addEventListener('touchend',function(item){
        endY = item.changedTouches[0].clientY; 

    })
   
    document.addEventListener('touchmove',function(){
        if(startY-endY>10)
            {
               searchwala.style.opacity='0' ;
               infowala.style.opacity = '0' ;
            }
            else {
                searchwala.style.opacity = '1' ; 
                infowala.style.opacity = '1'
                searchwala.style.transition = '.3s' 
                infowala.style.transition  = '.3s'  ;
            }
    })
  


}

if(window.innerWidth>630)
{
  

    const searchwala = document.querySelector('.searchwala') ; 
    const infowala = document.querySelector('.infowala')
    document.addEventListener('wheel', function(item){
           if(item.deltaY>0)
           {
            searchwala.style.opacity = '0'; 
           infowala.style.opacity = '0' ; 
          
           } 
           else {
            searchwala.style.opacity = '1'; 
            infowala.style.opacity = '1' ;
            searchwala.style.transition = '.3s' 
            infowala.style.transition  = '.3s'  ;
           }
    })
   
}

const searchbox = document.querySelector('form').firstElementChild; 
let collection = document.querySelector('title').innerHTML.split(' ')[0].toLowerCase();
let searchinfo = document.querySelector('.searchbox') ;
searchbox.addEventListener('input',function(){
 setTimeout(() => {
    if(this.value.length>1){
        fetch(`/product/search/${this.value}`,{
            method:"POST" ,
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                gender:collection
            })
        }).then((res)=>{
            if(res.ok) return res.json()
            else {console.log(error)}
        }).then((data)=>{
           let clutter =''; 
           searchinfo.style.display='block' ;
           if(data.length==0){clutter=`<h1>Nothing<h1>`} 
           else{

               data.forEach(element => {
                      clutter+=`<a href="/product/${element._id}" class="item h-12 flex gap-5 w-5/6 min-w-fit  ">
                  <img class="h-full w-1/6 object-cover " src="/images/uploads/${element.image}" alt="">
                  <h1 class="hover:text-zinc-500 transition-colors ">${element.name}</h1>
                 </a>`
               });
           }
           searchinfo.innerHTML = clutter ;
        })
      }
      else {
        searchinfo.style.display='none' ;
      }
 }, 1000);
})


const triggercollection = document.querySelector('.triggercollection'); 
const collectionitem = document.querySelector('.collection'); 
const triggerfilter = document.querySelector('.triggerfilter'); 
const filteritem = document.querySelector('.filter') ;

const priceindicator = document.querySelector('.priceindicator') ;
const colorindicator = document.querySelector('.colorindicator') ;
const sizeindicator = document.querySelector('.sizeindicator') ;
triggercollection.addEventListener('click',function(e){
    e.preventDefault()
    collectionitem.style.display = 'block'; 
    filteritem.style.display = 'none'; 
    priceindicator.style.display = 'none'
    colorindicator.style.display ='none'
    sizeindicator.style.display = 'none'
})
triggerfilter.addEventListener('click',function(e){
    e.preventDefault() ;
    collectionitem.style.display = 'none'; 
    filteritem.style.display = 'block'; 
})
const products = document.querySelector('.products'); 
var globaltype =null ;
collectionitem.addEventListener('click',function(item){
   if(item.target.nodeName==='BUTTON')
   { 
       const category = item.target.getAttribute("id") ;
       globaltype = category; 
       fetch(`/product/category/${category}`,{
         headers:{
            "data-type":"aplication/json" ,
            "collection":`${collection}`
         }
       }).then((res)=>{
         if(res.ok) return res.json()
         else{console.log(error)}
       }).then((data)=>{
          let product = ''
         data.forEach((item)=>{
            product +=`
           <div class="product lg:w-1/6 md:w-1/4 max-sm:w-1/2 relative   max-sm:min-w-44  min-w- h-full  border-b border-r border-black">
            <a href="/product/${item._id}" class="">
               <img class="w-full h-5/6 object-cover g-red-300 " src="/images/uploads/${item.image}" alt="">
            </a>
            <div class="h-1/6 text-sm text-extralight p-2 flex w-full justify-between">
              <a href="/product/${item._id}">
                <h1>${item.name}</h1>
                <h1>BDT  <span class="font-[sans-serif]">${item.price}</span></h1>
              </a>
              <a href="/user/cart/${item._id}" class="bg-white  ">
                <button class="cart-btn font-bold " title="Add To Cart" id="${item._id}" ><i class="ri-shopping-cart-line"></i></button>
               </a>
            </div>
           </div>`

         })
         products.innerHTML = product ;
         
       })
   }
})

filteritem.addEventListener('click',function(item){
    if(item.target.nodeName==='BUTTON'){
        if(item.target.innerHTML === 'Price')
        {
            priceindicator.style.display = 'block'
            colorindicator.style.display ='none'
             sizeindicator.style.display = 'none'
        }
        else if(item.target.innerHTML === 'Color')
        {
             colorindicator.style.display ='flex'
             priceindicator.style.display = 'none'
             sizeindicator.style.display = 'none'
        }
        else if(item.target.innerHTML === 'Size')
            {
                 colorindicator.style.display ='none'
                 priceindicator.style.display = 'none'
                 sizeindicator.style.display = 'flex'
            }
    }
})


const balanceindicator = document.querySelector('input[type="range"]') ; 
balanceindicator.addEventListener('change',function(){
 
    fetch(`/product/price/${this.value}`,{
        headers:{
            "collection":`${collection}` , 
            "category":`${globaltype}`
        }
    }).then((res)=>{
        if(res.ok)return res.json()
            else{
        console.log(error)
        }
    }).then((data)=>{
        let product = ''
        data.forEach((item)=>{
           product +=`
          <div class="product lg:w-1/6 md:w-1/4 max-sm:w-1/2 relative   max-sm:min-w-44  min-w- h-full  border-b border-r border-black">
           <a href="/product/${item._id}" class="">
              <img class="w-full h-5/6 object-cover g-red-300 " src="/images/uploads/${item.image}" alt="">
           </a>
           <div class="h-1/6 text-sm text-extralight p-2 flex w-full justify-between">
             <a href="/product/${item._id}">
               <h1>${item.name}</h1>
               <h1>BDT  <span class="font-[sans-serif]">${item.price}</span></h1>
             </a>
             <a href="/user/cart/${item._id}" class="bg-white  ">
               <button class="cart-btn font-bold " title="Add To Cart" id="${item._id}" ><i class="ri-shopping-cart-line"></i></button>
              </a>
           </div>
          </div>`

        })
        products.innerHTML = product ;
    })
   
})

colorindicator.addEventListener('click',function(item){
       if(item.target.nodeName==='BUTTON')
       {
        let color = item.target.getAttribute("id") ; 
        let balance = balanceindicator.value
        fetch(`/product/color/${color}`,{
            headers:{
                "category":`${globaltype}` ,
                "collection":`${collection}`,
                "balance":`${balance}`
            }
        }).then((res)=>{
            if(res.ok)return res.json(); 
            else {
                console.log(res.statusText)
            }
        }).then((data)=>{
            let product = ''
        data.forEach((item)=>{
           product +=`
          <div class="product lg:w-1/6 md:w-1/4 max-sm:w-1/2 relative   max-sm:min-w-44  min-w- h-full  border-b border-r border-black">
           <a href="/product/${item._id}" class="">
              <img class="w-full h-5/6 object-cover g-red-300 " src="/images/uploads/${item.image}" alt="">
           </a>
           <div class="h-1/6 text-sm text-extralight p-2 flex w-full justify-between">
             <a href="/product/${item._id}">
               <h1>${item.name}</h1>
               <h1>BDT  <span class="font-[sans-serif]">${item.price}</span></h1>
             </a>
             <a href="/user/cart/${item._id}" class="bg-white  ">
               <button class="cart-btn font-bold " title="Add To Cart" id="${item._id}" ><i class="ri-shopping-cart-line"></i></button>
              </a>
           </div>
          </div>`

        })
        products.innerHTML = product ;
        })
       }
})

document.addEventListener('click',function(){
    searchinfo.style.display='none'; 

})