"use strict";
let objStores = {
    user_data: {
        autoIncrement: true,
        unique: true
    },
    sightings: {
        autoIncrement: true,
        unique: false
    }
};
let user_data = "user_data";
let sightings = "sightings";
class indexDBHandler{
    constructor(dbName,objStores,debug=false){
        this.indexedDB = indexedDB;
        this.currentDB = this.indexedDB.open(dbName);
        this.warning = document.getElementById('client_warn');
        this.currentDB.addEventListener("error", function(error) {
            this.warning.innerHTML = '<h1>Warning: Offline Mode is not available</h1>';
            if (debug){
                console.log('Error opening database' + JSON.stringify(error));
            }
        });

        this.currentDB.addEventListener("success", function(event) {
            if (debug){
                console.log('Database opened successfully');
            }
        });

        this.currentDB.addEventListener("upgradeneeded", function(ev) {
            const db = ev.target.result;
            for (const [key, value] of Object.entries(objStores)){
                // Had to change the check for dict as no type of that name in JS
                 if (!db.objectStoreNames.contains(key) && value.constructor === Object){
                      db.createObjectStore(key,value);
                 } else {
                     console.log("ObjectStore format error");
                 }
            }
        });
    }

    create(objStoreName, data,callback){
        const idbResult = this.currentDB.result;
        const transaction = idbResult.transaction(objStoreName, "readwrite");
        const store = transaction.objectStore(objStoreName);
        const addRequest = store.add(data);
        addRequest.addEventListener("success", function (event) {
            if (callback){
                callback(addRequest.result);
            }
        });
    }

    request(objStoreName, key, callback){
        const idbResult = this.currentDB.result;
        const transaction = idbResult.transaction(objStoreName, "readonly");
        const store = transaction.objectStore(objStoreName);
        const getRequest = store.get(key);
        getRequest.addEventListener("success", function (event) {
            if (callback){
                callback(getRequest.result);
            }
        });
    }

    update(objStoreName, key, data, callback){
        const idbResult = this.currentDB.result;
        const transaction = idbResult.transaction(objStoreName, "readwrite");
        const store = transaction.objectStore(objStoreName);
        const updateRequest = store.put(data,key);
        updateRequest.addEventListener("success", function (event) {
            if (callback){
                callback(updateRequest.result);
            }
        });
    }

    delete(objStoreName, key, callback){
        const idbResult = this.currentDB.result;
        const transaction = idbResult.transaction(objStoreName, "readwrite");
        const store = transaction.objectStore(objStoreName);
        const deleteRequest = store.delete(key);
        deleteRequest.addEventListener("success", function (event) {
            if (callback){
                callback(deleteRequest.result);
            }
        });
    }

    getAll(objStoreName, callback){
        const idbResult = this.currentDB.result;
        const transaction = idbResult.transaction(objStoreName, "readonly");
        const store = transaction.objectStore(objStoreName);
        const getRequest = store.getAll();
        getRequest.addEventListener("success", function (event) {
            if (callback){
                callback(getRequest.result);
            }
        });
    }
}
let handler = new indexDBHandler('application', objStores, true);