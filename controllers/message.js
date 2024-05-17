const messageModel = require('../models/message');
exports.create = function(messageData){
    let message = new messageModel({
        sighting: messageData.sighting,
        message: messageData.message,
        userNickName: messageData.userNickName,
        dateTimestamp: messageData.dateTimestamp,
        idempotency_token: messageData.idempotency_token
    });

    return this.idempotency_check(messageData.idempotency_token).then((dupe) => {
        if (!dupe) {
            return message.save().then(message => {
                console.log("message saved");
                return JSON.stringify(message);
            }).catch(err => {
                console.log(err);
                return null;
            });
        } else {
            return null;
        }
    });
};

exports.getAllBySighting = function(sighting){
    return messageModel.find({sighting:sighting}).sort('dateTimestamp').then((messages) =>{
       if (messages == null){
           return [];
       }
       return JSON.stringify(messages);
    }).catch(err => {
            return [];
        }
    )
}

exports.idempotency_check= function(token){
    return messageModel.findOne({idempotency_token: token}).then(message => {
        console.log(typeof(message));
        if (message === undefined || message === null){
            console.log("No duplicate")
            return false;
        }
        else{
            return message;
        }
    }).catch(err => {
        console.log(err);
        return false;
    });
}