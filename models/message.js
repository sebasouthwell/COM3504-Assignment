var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema(
    {
        sighting: {type: Schema.Types.ObjectId, ref: 'Sighting', required: true},
        message: {type: String, required: true, max: 100},
        userNickName: {type: String, required: true, max: 100},
        dateTimestamp   : {type: Date, required: true},
        idempotency_token : {type: String, required: true, max:100, unique: true}
    });

MessageSchema.set('toObject', {getters: true, virtuals: true});

//On some combionations of Node and Mongoose only the following command works - in theory they should be equivalent
//CharacterSchema.set('toObject', {getters: true, virtuals: true});

// the schema is useless so far
// we need to create a model using it
var Message = mongoose.model('Message', MessageSchema);

// make this available to our users in our Node applications
module.exports = Message;