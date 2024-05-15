const messageModel = require('../models/message');
exports.create = function(messageData){
    let message = new messageModel({
        sighting: messageData.sighting,
        message: messageData.message,
        userNickName: messageData.userNickName,
        dateTimestamp: messageData.dateTimestamp
    });
    return message.save().then(message => {
        return JSON.stringify(message);
    }).catch(err => {
        console.log(err);
        return null;
    });
};

exports.getAllBySighting = function(sighting){
    return messageModel.find({sighting:sighting}).then((messages) =>{
       if (messages == null){
           return [];
       }
        return JSON.stringify(messages);
    }).catch(err => {
            return [];
        }
    )
}