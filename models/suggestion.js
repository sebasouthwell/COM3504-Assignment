var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SuggestionsSchema = new Schema(
    {
        sighting: {type: Schema.Types.ObjectId, ref: 'Sighting', required: true},
        suggestedName: {type: String, required: true, max: 100},
        DBPediaURL: {type: String, required: true, max: 100},
        suggestorNickname: {type: String, required: true, max: 100},
        status: {type: String, required: true, max: 100}
    });


SuggestionsSchema.set('toObject', {getters: true, virtuals: true});

//On some combinations of Node and Mongoose only the following command works - in theory they should be equivalent
//CharacterSchema.set('toObject', {getters: true, virtuals: true});

// the schema is useless so far
// we need to create a model using it
var Suggestion = mongoose.model('Suggestion', SuggestionsSchema);

// make this available to our users in our Node applications
module.exports = Suggestion;