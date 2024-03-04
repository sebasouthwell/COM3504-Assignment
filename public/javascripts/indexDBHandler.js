"use strict";

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
                 if (!db.objectStoreNames.contains(key) && typeof value === 'dict'){
                      db.createObjectStore(key,value);
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

db.createObjectStore("tasks",{keyPath: "id", autoIncrement: true})

let objStores = {
    tasks: {keyPath: "id", autoIncrement: true},
    messages: {keyPath: "id", autoIncrement: true},
    users:
        {
            keyPath: "id",
            autoIncrement: true,
            unique: true
        }
}