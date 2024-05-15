let name = null;
let current_sighting = null;
let otherRooms = [];
let onlinePage = false;
let socket = io();
let onlineStatus = false;
function isOnline() {
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
function genRandomName(wordCount,maxNum){
    var word_list = "https://raw.githubusercontent.com/felixfischer/categorized-words/master/2of12id.json"
    fetch(word_list).then((response) =>{
        response.json().then(
            (respJSON) => {
                let words = respJSON['N'];
                let nickname = ""
                for (let i = 0; i < wordCount; i++){
                    nickname += words[Math.floor(Math.random() * words.length)]
                }
                nickname += Math.floor(Math.random()*maxNum).toString()
                name = nickname;
                console.log(name);
            }).catch(() => {

            }
        )
    }).catch(
        () => {
        }
    )
}

function loadNameAndSockets() {
    isOnline();
    console.log('Loaded')
    handler.request(user_data, 'name',
        (results) => {
        console.log(results)
        if (results === undefined){
            genRandomName(2,100);
            setTimeout(() => {
                handler.update(user_data, 'name',name,() => {
                    $('#nickname')[0].innerHTML = name;});
                },100);
        }
        else{
            name = results;
            $('#nickname')[0].innerHTML = name;
        }
        if (location.pathname.includes('sight_view')){
            connectToPageRoom();
        }
        fetch('/user_sightings/' + name).then(
            (response) => {
                let json = response.json().then(
                    (js_response) => {
                        if (js_response.includes(current_sighting)){
                            js_response.pop(current_sighting);
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
            }
        ).catch(() => {
            configureListeners();
                console.log('Could not get pages from user for notifications')
            }
        );
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
});

function connectToPageRoom() {
    onlinePage = location.pathname.includes('/sight_view/');
    if (onlinePage){
        current_sighting = location.pathname.split('/sight_view/')[1];
    }else{
        let url = new URL(location.href);
        current_sighting = url.searchParams.get("id");
    }
    connectToRoom(current_sighting);
    getPreviousChat();
}

function connectToRoom(roomNo) {
    socket.emit('create or join', roomNo, name);
}

function configureListeners() {
    // We are on a sighting page#
    console.log("Configuring listeners");
    socket.on('comment', function(room,userid,comment){
        if (userid !== name){
            if (room === current_sighting){
                writeOnHistory(userid, comment, new Date());
            }
            else if (otherRooms.includes(room)){
                // If it's from a different page, we notify the user
                makeNotification('New Comment on Your Sighting', {body: `${userid}: ${comment}`});
            }
        }
    })
    socket.on('suggestion', function (room,userid,suggest){
        if (userid !== name){
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
        handler.request(messages,current_sighting,(response) => {
            console.log("Messages ready for upload")
            console.log(response)
            if (response !== undefined){
                for (let i = 0; i < response.length; i++){
                    writeOnHistory(response[i]['userNickName'],response[i]['message'],new Date(response[i]['dateTimestamp']));
                }
            }
        });
    })
}


/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    if (onlinePage){
        socket.emit('suggestion', current_sighting, name, chatText);
    }
    if (!onlineStatus){
        handler.request(messages,current_sighting, (response) => {
            if (response === undefined){
                response = [];
            }
            response.push({
                room: current_sighting,
                userNickName: name,
                message: chatText,
                dateTimestamp: Date.now(),
                onlinePage: onlinePage
            });
            console.log('Offline saving message');
            handler.update(messages,current_sighting, response, (response) => {

            });
        });
    }
    writeOnHistory(name, chatText, new Date());
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