const activity = require('../models/imazinActivity-model'); 
const socketIO = require('socket.io');
let io;

module.exports = {

    init: function (server) {
     const allowOrigin = ['http://localhost:5173','https://imazine.netlify.app']
        io = socketIO(server, {  
            cors:{
                origin:(origin, callback) => {
                    if (allowOrigin.includes(origin) || !origin) {
                      callback(null, true);
                    } else {
                      callback(new Error('Not allowed by CORS'));
                    }
                  }, 
                methods:["GET", "POST"] , 
                credentials:true 
              }
        });
        io.on("connection" ,  (socket)=>{
         
            socket.on('active_user', async(data)=>{
             if(data)
            {
            await activity.create({
                  active:true  , 
                  userId: data   
             })
             }  
          socket.broadcast.emit('active_userlist', data)
             }) 
      
             socket.on('offline_user', (data)=>{
           
                 socket.broadcast.emit('offline_userlist' , data) ;
             })
        
              socket.on('join_room', (data)=>{ 
                  socket.join((String(data.receiverId)+String(data.senderId)).split('').sort().join('')); 
              })   
             
              socket.on('sentMessage',(data)=>{ 
               
                 socket.to((String(data.receiverId)+String(data.senderId)).split('').sort().join('')).emit('receiveMessage',data);
                 socket.broadcast.emit('popmessage', data)  
              })  
       
              
              socket.on('CallingFrom',(data)=>{
                  socket.broadcast.emit("CallingFrom",data)
                  console.log(data.senderId, data.receiverId)
              })
              
                    
              socket.on('CallRejected',(data)=>{
                  socket.broadcast.emit("CallRejected",data)
                
              })
              
              
              // socket.on('calling',(data)=>{
                
              //     socket.broadcast.emit("calling" , data)
              // })
      
              // socket.on('call:accepted', (data)=>{
               
              //    socket.broadcast.emit('call:accepted',data)
              // })
              // socket.on('peer:nego:needed',(data)=>{
                
              //     socket.broadcast.emit('peer:nego:needed',data)
              // })
              // socket.on('peer:nego:final',(data)=>{
              
              //     socket.broadcast.emit('peer:nego:final',data)
              // })
                
              socket.on('disconnect', ()=>{
                  console.log('disconnected') 
              })
           
        }) ; 

        return io;
    },

    getIO: function () {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};














