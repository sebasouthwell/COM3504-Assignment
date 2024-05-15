var message = require('../controllers/message');
exports.init = function(io) {
    io.sockets.on('connection', function (socket) {
        try {
            socket.on('create or join', function (room, userId) {
                socket.join(room);
                console.log({room: room, userId: userId});
                io.sockets.to(room).emit('joined', room, userId);
            });

            socket.on('comment', function (room, userId, comment) {
                io.sockets.to(room).emit('comment', room, userId, comment);
                message.create({
                    sighting: room,
                    userNickName: userId,
                    message: comment,
                    dateTimestamp: new Date()
                }).then(() => {
                    console.log({room: room, userId: userId, comment: comment});
                    }
                ).catch(
                    err => {
                        console.log(err);
                    }
                )
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