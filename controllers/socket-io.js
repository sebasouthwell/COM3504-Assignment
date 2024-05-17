var message = require('../controllers/message');
var suggestions = require('../controllers/suggestions')
function generateQuickGuid() {
    return Math.random().toString(36).substring(2, 25) +
        Math.random().toString(36).substring(2, 25);
}

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
                let token = generateQuickGuid();
                console.log(token);
                message.create({
                    sighting: room,
                    userNickName: userId,
                    message: comment,
                    dateTimestamp: new Date(),
                    idempotency_token: token,
                }).then(() => {
                    console.log({room: room, userId: userId, comment: comment});
                    }
                ).catch(
                    err => {
                        console.log(err);
                    }
                )
            });

            socket.on('suggestion', function (room, userId, sighting_url, sighting_name) {
                suggestions.create({
                    sighting: room,
                    suggestedName: sighting_name,
                    DBPediaURL: sighting_url,
                    suggestorNickname: userId,
                    status: 'pending'
                }).then((suggestion) => {
                    io.sockets.to(room).emit('suggestion',room, userId, sighting_url, sighting_name, suggestion._id);
                });
            });
            socket.on('disconnect', function(){
               // console.log('someone disconnected');
            });
        } catch (e) {
        }
    });
}