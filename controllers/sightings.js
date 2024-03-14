const sightingModel = require('../models/sighting');


exports.create = function(sightingData, filePath){
    let sighting = new sightingModel({
        plantName: sightingData.plantName,
        hasFruit: sightingData.hasFruit,
        hasSeeds: sightingData.hasSeeds,
        hasFlowers: sightingData.hasFlowers,
        flowerColour: sightingData.flowerColour,
        plantEstHeight: sightingData.plantEstHeight,
        plantEstSpread: sightingData.plantEstSpread,
        sunExposureLevel: sightingData.sunExposureLevel,
        photo: filePath,
        userNickName: sightingData.userNickName,
        identificationStatus: sightingData.identificationStatus,
        givenName: sightingData.givenName,
        lat: sightingData.lat,
        long: sightingData.long,
        description: sightingData.description,
        dateTime: sightingData.dateTime,
        DBPediaURL: sightingData.DBPediaURL
    });

    return sighting.save().then(sighting => {
        return JSON.stringify(sighting);
    }).catch(err => {
        console.log(err);
        return null;
    });
};

exports.getAll = function(){
    return sightingModel.find({}).then(sightings => {
        return JSON.stringify(sightings);
    }).catch(err => {
        console.log(err);
        return null;
    });
}

exports.getByID = function(id){
    return sightingModel.findById(id).then(sighting => {
        return JSON.stringify(sighting);
    }).catch(err => {
        console.log(err);
        return null;
    });
}

exports.count = function(){
    return sightingModel.countDocuments().then(count => {
        return count;
    }).catch(err => {
        console.log(err);
        return null;
    });
}