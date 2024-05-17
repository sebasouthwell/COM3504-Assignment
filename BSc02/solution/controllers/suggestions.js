const suggestionModel = require("../models/suggestion");
const messageModel = require("../models/message");
exports.create = function(suggestionData){
    let suggestion = new suggestionModel({
        sighting: suggestionData.sighting,
        suggestedName: suggestionData.suggestedName,
        DBPediaURL: suggestionData.DBPediaURL,
        suggestorNickname: suggestionData.suggestorNickname,
        status: suggestionData.status
    });

    return suggestion.save().then(suggestion => {
        console.log("suggestion saved");
        return JSON.stringify(suggestion);
    }).catch(err => {
        console.log(err);
        return null;
    })
};


exports.getAllBySighting = function(sighting){
    return suggestionModel.find({sighting:sighting}).then((suggestions) =>{
        if (suggestions == null){
            return [];
        }
        return JSON.stringify(suggestions);
    }).catch(err => {
            return [];
        }
    )
}

exports.accept = function(id,user){
    return suggestionModel.updateOne({_id:id},{status: 'Accepted'}).then(suggestion =>
    {
        return suggestion;
    }).catch((err)=>{
        return false;
    })
}

exports.reject = function(id,user){
    return suggestionModel.updateOne({_id:id},{status: 'Rejected'}).then(suggestion =>
    {
        if (suggestion !== null){
            return true;
        }
        else{
            return false;
        }
    }).catch((err)=>{
        return false;
    })
}

exports.getAllIncompleteSuggestions = function (sighting){
    return suggestionModel.find({sighting:sighting, status:"pending"}).then((suggestions) =>{
        if (suggestions == null){
            return [];
        }
        return JSON.stringify(suggestions);
    }).catch(err => {
            return [];
        }
    )
}

exports.getByID = function (id){
    return suggestionModel.find({_id:id}).then((suggestion) =>{
        if (suggestion == null){
            return [];
        }
        return JSON.stringify(suggestion);
    }).catch(err => {
            return [];
        }
    )
}