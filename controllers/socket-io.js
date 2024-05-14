exports.init = function(io) {
    io.sockets.on('connection', function (socket) {
        try {
            socket.on('create or join', function (room, userId) {
                socket.join(room);
                console.log({room: room, userId: userId});
                io.sockets.to(room).emit('joined', room, userId);
            });

            socket.on('comment', function (room, userId, comment) {
                console.log({room: room, userId: userId, comment: comment});
                io.sockets.to(room).emit('comment', room, userId, comment);
            });

            socket.on('suggestion', function (room, userId, chatText) {
                io.sockets.to(room).emit('suggestion', room, userId, chatText);
            });

            socket.on('disconnect', function(){
                console.log('someone disconnected');
            });
        } catch (e) {
        }
    });
}