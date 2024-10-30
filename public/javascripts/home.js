const slider = document.querySelector(".slider");

const pictures = document.querySelectorAll("picture");

const totalpicture = pictures.length;
var index = 1;
const maxdown = totalpicture * pictures[1].offsetTop;
const maxup = pictures[0].offsetTop;

window.onload = () =>{
    index = 1 ;
    window.scrollBy({
        top: -maxdown,
        behavior: "smooth", 
      });
}  

let position = pictures[1].offsetTop;

    let showtime =  setInterval(function () {
        if (index === totalpicture) {
          window.scrollBy({
            top: -maxdown,
            behavior: "smooth", 
          });
    
          index = 0;
        } else {
          window.scrollBy({
            top: position, 
            behavior: "smooth", 
          });
        }
    
       
        index++;
      }, 3500);

  document.addEventListener("wheel", function (item) {
    clearInterval(showtime);
  });

  const searchbox = document.querySelector('form').firstElementChild; 
  
  
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
                  gender:"man woman kid"
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
                        clutter+=`<a href="/product/${element._id}" class="item h-12 flex gap-5 w-5/6 min-w-fit ">
                    <img class="h-full w-1/6 object-cover" src="/images/uploads/${element.image}" alt="">
                    <h1>${element.name}</h1>
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
  
  document.addEventListener('click',function(){
      searchinfo.style.display='none'; 
  })
    