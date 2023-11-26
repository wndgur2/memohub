import { Server } from "socket.io";

export default (req,res)=>{
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server);
    
        io.on('connection', (socket) => {
          console.log(socket +' Client connected');
            
          socket.emit('welcome', 'Welcome to the Socket.IO server!');

          socket.on('userCome', (url) => {
            console.log(socket+' 연결됨');
            socket.join(url);
            socket.broadcast.to(url).emit('userCome','welcome');
          });

          socket.on('addMemo',(url,memo)=>{
            console.log(socket +' 메모 남김');
            socket.broadcast.to(url).emit('addMemo',memo);
          })

          socket.on('disconnect', () => {
            console.log('Client disconnected');
          });

        });
    
        res.socket.server.io = io;
      }
    
      res.json('hi');
}