var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SightingSchema = new Schema(
    {
            lat: {type: Schema.Types.Decimal128, required: true},
            long: {type: Schema.Types.Decimal128, required: true},
        description: {type: String, required: true, max: 100},
        plantEstHeight: {type: Number, required: false},
        plantEstSpread: {type: Number, required: false},
        flowerColour: {type: String, required: false},
        hasSeeds: {type: Boolean, required: false},
        hasFlowers: {type: Boolean, required: false},
        hasFruit: {type: Boolean, required: false},
        sunExposureLevel: {type: Number, required: true},
        photo: {type: String, required: false},
        userNickName: {type: String, required: true, max: 100},
        identificationStatus: {type: String, required: true, max: 100},
        givenName: {type: String, required: false, max: 100},
        dateTime : {type: Date, required: true},
        DBPediaURL: {type: String, required: false, max: 100}
    }
);


SightingSchema.set('toObject', {getters: true, virtuals: true});

//On some combionations of Node and Mongoose only the following command works - in theory they should be equivalent
//CharacterSchema.set('toObject', {getters: true, virtuals: true});

// the schema is useless so far
// we need to create a model using it
var Sighting = mongoose.model('Sighting', SightingSchema);

// make this available to our users in our Node applications
module.exports = Sighting;