let name = null;
let current_sighting = null;
let otherRooms = [];
let onlinePage = false;
let mySighting = false;
let socket = io();
let suggestionTemplate = null;
const generateQuickGuid = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
async function genRandomName(wordCount,maxNum){
    var word_list = "https://raw.githubusercontent.com/felixfischer/categorized-words/master/2of12id.json";
    try{
        w_list_promise = await fetch(word_list);
        if (w_list_promise.status=== 200){
            js_promise = await w_list_promise.json();
            let words = js_promise['N'];
            let nickname = "";
            for (let i = 0; i < wordCount; i++){
                nickname += words[Math.floor(Math.random() * words.length)]
            }
            nickname += Math.floor(Math.random()*maxNum).toString()
            return nickname;
        }
        else {
            return null;
        }
    }
    catch(e){
        return null;
    }
}

async function userSightings(user){
    try{
        let res = await fetch('/user_sightings/' + user).then((res) => res.json()).catch((e) => {
            return [];
        })
        return res;
    }
    catch (e){
        return [];
    }
}


function loadNameAndSockets() {
    isOnline();
    console.log('Loaded')
    handler.request(user_data, 'name',
        (results) => {
        console.log(results)
        if (results === undefined || results === null) {
            genRandomName(2,100).then(
                (nickname) => {
                    console.log(`Name: ${nickname}`)
                    if (nickname !== undefined) {
                        name = nickname;
                        handler.update(user_data, 'name',nickname,() => {
                            $('#nickname')[0].innerHTML = nickname;});
                    }
                }
            )
        }
        else{
            name = results;
            $('#nickname')[0].innerHTML = name;
        }
        if (location.pathname.includes('sight_view')){
            connectToPageRoom();
        }
        userSightings(name).then((js_response) => {
                        if (js_response.includes(current_sighting)){
                            js_response.pop(current_sighting);
                            mySighting = true;
                        }
                        otherRooms = js_response;
                        for (let i = 0; i < otherRooms.length; i++) {
                            connectToRoom(otherRooms[i]);
                        }
                        console.log(otherRooms);
                        configureListeners();
                    }
                ).catch(() =>{
                    console.log('Failed to get other rooms')
                    configureListeners();
                })
            });
}

function changeName(new_name){
    name =new_name;
    handler.update(user_data, 'name',new_name,() => {
        $('#nickname')[0].innerHTML = new_name;});
}

window.addEventListener('load', () =>{
    isOnline();
    loadNameAndSockets();
    requestSync();
});

function connectToPageRoom() {
    onlinePage = location.pathname.includes('/sight_view/');
    if (onlinePage){
        current_sighting = location.pathname.split('/sight_view/')[1];
    }else{
        let url = new URL(location.href);
        current_sighting = url.searchParams.get("id");
    }
    suggestionTemplate = $('#suggestion_interface div')[0];
    connectToRoom(current_sighting);
    getPreviousChat();
    getPreviousSuggestions();
}

function connectToRoom(roomNo) {
    socket.emit('create or join', roomNo, name);
}

function configureListeners() {
    // We are on a sighting page#
    console.log("Configuring listeners");
    socket.on('comment', function(room,userid,comment){
        fetch('/sighting_data/' + room ).then(
            (response) => {
                response.json().then((response) => {
                    let sightingNick = response['userNickName'];
                    if (sightingNick === name && userid !== name){
                        if (otherRooms.includes(room)){
                            // If it's from a different page, we notify the user
                            console.log("NOTIF triggered from socket");
                            makeNotification('New Comment on Your Sighting', {body: `${userid}: ${comment}`});
                        } else {
                            writeOnHistory(userid, comment, new Date());
                        }
                    }
                })
            }
        );
    })
    socket.on('suggestion', function (room, userId, sighting_url, sighting_name, id){
        if (userId !== name){
            if (room === current_sighting) {
                // If it's from this page, we display directly on the page
            }
            else if (otherRooms.includes(room)){
                // If it's from a different page, we notify the user
            }
        }
    });
}

function getPreviousChat(){
    fetch('/sight_messages/' + current_sighting ).then(
        (response) => {
            response.json().then((response) => {
                for (let i = 0; i < response.length; i++){
                    writeOnHistory(response[i]['userNickName'],response[i]['message'],new Date(response[i]['dateTimestamp']));
                }
            })
        }
    ).catch((error) => {
        onlineStatus = false;
        writeOnHistory('Error', 'Cannot receive previous messages from server, these are available once you return online.',new Date());
        // Get index db history
    })
    handler.request(messages,current_sighting,(response) => {
        console.log(response)
        if (response !== undefined){
            var values = Object.keys(response).map(function(key){
                return response[key];
            });
            values.sort((a,b) => a.dateTimestamp - b.dateTimestamp)
            for (i = 0; i < values.length; i++){
                writeOnHistory(values[i]['userNickName'],values[i]['message'],new Date(values[i]['dateTimestamp']));
            }
        }
    });
}

function getPreviousSuggestions(){
    fetch('/suggestion_data/' + current_sighting).then((response) => {
        response.json().then((response) => {
            for (let i = 0; i < response.length; i++){
                let sugg = response[i]
                let suggestion = suggestionTemplate.cloneNode(true);
                suggestion.getElementsByClassName('suggestion_name')[0].innerHTML = "Name: " + sugg['suggestedName']
                suggestion.getElementsByClassName('suggestion_dbpedia')[0].innerHTML = 'DBpedia: '+  sugg['DBPediaURL']
                suggestion.getElementsByClassName('suggestion_user')[0].innerHTML ='Suggested by: '+ sugg['suggestorNickname']
                suggestion.hidden = false;
                let successBTN = suggestion.getElementsByClassName('accept_link')[0];
                let rejectedBTN = suggestion.getElementsByClassName('reject_link')[0];
                console.log(successBTN, rejectedBTN);
                successBTN.href = '/accept/' + sugg['_id'] + "?user=" + name;
                rejectedBTN.href ='/reject/' + sugg['_id']+ "?user=" + name;
                suggestion_interface.appendChild(suggestion);

            }
        })
        suggestionTemplate.hidden = true;
    })
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    if (onlinePage){
        socket.emit('comment', current_sighting, name, chatText);
    }
    if (!onlineStatus){
        handler.request(messages,current_sighting, (response) => {
            if (response === undefined){
                response = {};
            }
            let guid = generateQuickGuid(24);
            response[guid] ={
                room: current_sighting,
                userNickName: name,
                message: chatText,
                dateTimestamp: Date.now(),
                onlinePage: onlinePage,
                idempotency_token: generateQuickGuid(24)
            };
            console.log('Offline saving message');
            handler.update(messages,current_sighting, response, (response) => {
                requestSync();
            });
        });
    }
    writeOnHistory(name, chatText, new Date());
}

function sendSuggestion(event){
    event.preventDefault();
    let manualInput = $('#manualDBPedia')[0];
    let dbPediaURL = $('#DBpediaURL')[0];
    let plant_name = $('#PlantName')[0];

    let sighting_name = $('#DBpediaName option:selected')[0].text;
    let sighting_url = $('#DBpediaName option:selected')[0].value;
    if (manualInput.children[0].checked){
       sighting_name = plant_name.value;
       sighting_url = dbPediaURL.value;
    }
    DBpediaQuery(sighting_url).then((res) => {
        if (res.length > 0){
            socket.emit('suggestion', current_sighting, name, sighting_url,sighting_name);
        }
        else{
            alert('Please select a valid DBpedia URL');

        }
    })
}

/**
 * it appends the given html text to the history div
 * @param text: teh text to append
 */
function writeOnHistory(user,message, time) {
    console.log(time);
    let text = `<br>${user}: ${message} - ${time.toDateString()}`
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}