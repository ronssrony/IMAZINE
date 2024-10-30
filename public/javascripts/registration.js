const needaccount = document.querySelector('.needaccount')  ; 
const signup = document.querySelector('.singup');  
const login = document.querySelector('.login')
needaccount.addEventListener('click', function(e){
    e.preventDefault(); 

   document.querySelector('.main').style.flexDirection = "column"
   signup.style.display = 'block' ;
   login.style.display = 'none'; 

})
document.querySelector('.sidelogin').addEventListener('click',function(e){
    e.preventDefault() ;
    document.querySelector('.main').style.flexDirection = "column-reverse"
    signup.style.display = 'none' ;
    login.style.display = 'block'; 
})