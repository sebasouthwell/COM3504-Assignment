const requestModel = require('../models/requests');


exports.create = function(requestData){
    let request = new requestModel({
        idempotentToken: requestData.idempotentToken,
        requestType: requestData.requestType,
        completed: requestData.completed
    });
    return request.save().then(request => {
        return JSON.stringify(request);
    }).catch(err => {
        console.log(err);
        return null;
    });
};

exports.getByIdempotentToken = function(idempotentToken){
    return requestModel.find({idempotentToken: idempotentToken}).then(requests => {
        return JSON.stringify(requests);
    }).catch(err => {
        console.log(err);
        return null;
    });
}