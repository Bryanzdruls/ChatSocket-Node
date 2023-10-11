const { verifyJWT } = require("../../middlewares");
const { ChatMessages } = require("../../models");
const chatMessages = new ChatMessages();
const socketController = async( socket,io ) =>{
    const token = socket.handshake.headers['x-token'];
    const user = await verifyJWT(token);
    if (!user) {
        return socket.disconnect();
    }
    //agregar usuario
    chatMessages.connectUser(user);
    io.emit('active-users',chatMessages.usersArr);
    socket.emit('get-messages', chatMessages.lastTen );
    //Conectarlo a una sala
    socket.join(user.id); //global, socket.id user.id
    //Limpiar
    socket.on('disconnect',() =>{
        chatMessages.disconnectUser(user.id);
        io.emit('active-users',chatMessages.usersArr);
    }) 
    socket.on('send-msg', ({uid, msg}) =>{
        if (!uid) {
            chatMessages.sendMsg(user.uid,user.name, msg);
            io.emit('get-messages', chatMessages.lastTen );    
        }else{
            //Msg Privado
            socket.to(uid).emit('private-msg',{from:user.name, msg});
        }
    })
}

module.exports = {
    socketController
}