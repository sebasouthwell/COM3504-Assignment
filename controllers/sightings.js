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
        DBPediaURL: sightingData.DBPediaURL,
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
        let newSightings = [];
        for (let i = 0; i < sightings.length; i++){
            newSightings.push(parseSighting(sightings[i]));
        }
        return JSON.stringify(newSightings);
    }).catch(err => {
        console.log(err);
        return null;
    });
}

const parseSighting = function(sighting){
    let s = {
        _id: sighting['_id'].toString(),
        plantName: sighting['plantName'],
        hasFruit: sighting['hasFruit'],
        hasSeeds: sighting['hasSeeds'],
        hasFlowers: sighting['hasFlowers'],
        flowerColour: sighting['flowerColour'],
        plantEstHeight: sighting['plantEstHeight'],
        plantEstSpread: sighting['plantEstSpread'],
        sunExposureLevel: sighting['sunExposureLevel'],
        photo: sighting['photo'],
        userNickName: sighting['userNickName'],
        identificationStatus: sighting['identificationStatus'],
        givenName: sighting['givenName'],
        lat: sighting['lat'].toJSON()['$numberDecimal'],
        long: sighting['long'].toJSON()['$numberDecimal'],
        description: sighting['description'],
        dateTime: sighting['dateTime'],
        DBPediaURL: sighting['DBPediaURL']
    }
    return s;
}

exports.getAllFilter = function(query_map){
    return sightingModel.find(query_map).then(sightings => {
        let newSightings = [];
        for (let i = 0; i < sightings.length; i++){
            newSightings.push(parseSighting(sightings[i]));
        }
        return JSON.stringify(newSightings);
    }).catch(err => {
        console.log(err);
        return null;
    });
}

exports.getByID = function(id){
    return sightingModel.findById(id).then(sighting => {
        // Create a new object with the lat and long as numbers
        let s = parseSighting(sighting);
        console.log(s);
        return JSON.stringify(s);
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