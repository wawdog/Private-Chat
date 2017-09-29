
var UserSession = require('../service/userSession');
var ChatService = require('../service/chatService');
var md5 = require('crypto-js/md5');
function SocketService(io) {

    var SocketUser = {};
    var TimeOut = null;
    
    io.sockets.on('connection', function (socket) {
       
       socket.on('join',function(user){

            SocketUser[user.id] = socket.id; // SocketUser = {user.id : socket.id}
            socket.user = user;

            socket.broadcast.emit('user joined',user);
            clearTimeout(TimeOut);
            console.log(socket.user.email + ' Join to chat'); 

        });

       socket.on('chat.room',function(data){

            var id = SocketUser[data.user.id];
            var room_id = md5(data.room).toString();
            if(id){
                ChatService.messageHistory(room_id, function(messages){
                    io.sockets.connected[id].emit('history.message',messages);
                });
            }

        });
        

        socket.on('chat.message', function (data) {
        
            var id = SocketUser[data.user_to_id];
                if(id){
                   data.room_id =  md5([data.user_from_id, data.user_to_id].sort().join('')).toString();
                   ChatService.addMessage(data,function(data){
                       io.sockets.connected[id].emit('send.message',data);
                        console.log('Message added to database');
                   })
       
                }
                   
        });

        socket.on('chat.notify', function(message){
           
            var id = SocketUser[message.user_to_id];
            if(id){
                ChatService.getNotify(message.user_to_id,function(data){
                    io.sockets.connected[id].emit('get.notify',{data : data, message : message});
                });
            }
        });

        socket.on('chat.update',function(message){
            var id = SocketUser[message.user_to_id];
            if(id){
                ChatService.readMessage(message.message_id,function(){});

            }
        });


        socket.on('disconnect', function () {
       
            if(socket.user){
                TimeOut = setTimeout(function(){ 
                    UserSession.offline({id : socket.user.id}, function(){
                        socket.broadcast.emit('leavechat',socket.user);
                        console.log(socket.user.email+ ' Leave chat'); 
                    });

                }, 5000);
            }

            
        });

    });

}

module.exports = SocketService;
