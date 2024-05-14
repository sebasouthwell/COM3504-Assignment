let name = null;
let current_sighting = null;
let otherRooms = [];
let socket = io();

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
    // Handler for DB
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
window.addEventListener('load', loadNameAndSockets);

function connectToPageRoom() {
    if (location.pathname.includes('/sight_view/')){
        current_sighting = location.pathname.split('/sight_view/')[1];
    }else{
        let url = new URL(location.href);
        current_sighting = url.searchParams.get("id");
    }
    connectToRoom(current_sighting);
}

function connectToRoom(roomNo) {
    socket.emit('create or join', roomNo, name);
}

function configureListeners() {
    // We are on a sighting page
    socket.on('comment', function(room,userid,comment){
      if (userid !== name){
          if (room === current_sighting) {
            // If it's from this page, we display directly on the page
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

function init() {
    // it sets up the interface so that userId and room are selected
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';

    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId) {
        if (userId === name) {
            // it enters the chat
            console.log("help")
        } else {
            // notifies that someone has joined the room
            writeOnHistory('<b>'+userId+'</b>' + ' joined room ' + room);
        }
    });
    // called when a message is received
    socket.on('comment', function (room, userId, chatText) {
        let who = userId
        if (userId === name) who = 'Me';
        writeOnHistory('<b>' + who + ':</b> ' + chatText);
    });
    socket.on('suggestion', function (room, userId, chatText) {
        let who = userId
        if (userId === name) who = 'Me';
        writeOnHistory('<b>' + who + ':</b> ' + chatText);
    });

}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    socket.emit('comment', current_sighting, name, chatText);
}

/**
 * it appends the given html text to the history div
 * @param text: teh text to append
 */
function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}
