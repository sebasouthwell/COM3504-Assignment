let onlineStatus = false;
async function base64toBlob(b64){
    try{
        let res = await fetch(b64);
        let blob = await res.blob();
        return blob;
    }
    catch(err){
        console.log(err);
        return null;
    }
}

async function getSightingForm(sighting, imageString){
    let formData = new FormData();
    let sighting_keys = sighting.key
    for (const key in sighting){
        formData.append(key, sighting[key])
    }
    if (imageString){
        let photoBlob = await base64toBlob(imageString);
        if (photoBlob){
            formData.append('photo', photoBlob, "image.png");
        }
    }
    return formData;
}

async function uploadSighting(sighting,imageString){
    try {
        let formData = await getSightingForm(sighting,imageString);
        let res = await fetch('/upload/sighting', {
            method: 'POST',
            body: formData
        }).then((response) => {
            return response.json();
        }).catch((response) => {
            return null;
        })
        return res === null ? null : res['id'];
    }
    catch (err){
        console.log(err);
        return null;
    }
}

async function uploadSightingsFromIndex(){
    handler.getAll(sightings,async (sighting_list) => {
        for (let i = 0; i < sighting_list.length; i++) {
            uploadSighting(sighting_list[i],sighting_list[i].photo).then((id) => {
                let sightingID = sighting_list[i]._id;
                console.log(sightingID);
                if (id){
                    handler.delete(sightings, sightingID, () => {
                    });
                }
            })
        }
    })
}

async function uploadChats(){
    handler.getAllKeys(messages, (keys) => {
        for (let key of keys){
            handler.request(messages,key,async (chats) => {
                console.log("Old Chats");
                console.log(chats);
                let keys = Object.keys(chats);
                for (let j = 0; j < keys.length; j++){
                    let key = keys[j];
                    console.log(key)
                    try{
                        let chat_message = JSON.stringify(chats[key]);
                        let res = await fetch('/upload/chat', {
                            method: 'POST',
                            body: chat_message,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then((response) => {
                            return response.json();
                        }).catch((response) => {
                            return null;
                        })
                        console.log(res);
                        if (res !== null && res['state'] === 'success'){
                            delete chats[key];
                            console.log(chats);
                        }
                    }
                    catch (err){
                        console.log(err);
                    }
                }
                console.log("New Chats");
                if (Object.keys(chats).length === 0){
                    handler.delete(messages,key,() => {});
                }
                else{
                    // This removes all uploaded chats from localDB
                    handler.update(messages, key, chats, () => {
                    });
                }
            });
        }
    })
}

function requestSync(){
    navigator.serviceWorker.ready.then(registration => {
        return registration.sync.register('sync-sighting');
    }).then(() => {
        console.log('Sync registered');
    }).catch(error => {
        console.log('Sync registration failed:', error);
    });
}
///Uploads any information that has been added while the site was offline when it comes back online
async function offlineToOnline(){
    try{
        let online = await onlineStatusAsync();
        if (online){
            await uploadSightingsFromIndex();
            await uploadChats();
        }
    }
    catch (err){
        console.log(err);
    }
}

function isOnline() {
    if (!navigator.onLine){
        onlineStatus = false;
    }
    //If sites not online get cashed web pages
    else{
        fetch(location.origin +'/cache_links').then((response) =>{
            console.log(response);
            if (response.status === 200){
                onlineStatus = true;
                console.log("In Online Mode");
            }
            else {
                onlineStatus = false;
                console.log("In Offline Mode");
            }
            return onlineStatus;
        }).catch(
            e => {
                onlineStatus = false;
                console.log("In Offline Mode");
                return onlineStatus;
            }
        )
    }
}

async function onlineStatusAsync(){
    if (!navigator.onLine){
        return false;
    }
    try{
        let res = await fetch(location.origin + '/cache_links');
        if (res.status === 200){
            return true;
        }
        else{
            return false;
        }
    }
    catch (err){
        return false;
    }
}