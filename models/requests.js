var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RequestSchema = new Schema(
    {
        idempotentToken: {type: String, required: true, max: 100},
        requestType: {type: String, required: true, max: 100},
        completed: {type: Boolean, required: true}
    });

RequestSchema.set('toObject', {getters: true, virtuals: true,
    transform: function (doc, ret) {
        ret.lat = parseFloat(ret.lat);
        ret.long = parseFloat(ret.long);
        return ret;
    }
    });

//On some combionations of Node and Mongoose only the following command works - in theory they should be equivalent
//CharacterSchema.set('toObject', {getters: true, virtuals: true});

// the schema is useless so far
// we need to create a model using it
var Request = mongoose.model('Request', RequestSchema);

// make this available to our users in our Node applications
module.exports = Request;