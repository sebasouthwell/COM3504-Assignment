window.addEventListener('load', updateNickname);

function updateNickname() {

    let objStores = {
        users: {
            autoIncrement: true,
            unique: true
        }
    };

    // Handler for DB
    let handler = new indexDBHandler('nicknames', objStores, true);

    var nickname = "N/A";
    // Check all users for logged in account
    handler.currentDB.onsuccess = (event) => {
        handler.getAll('users', function (result) {
            for (var i = 0; i <= Object.keys(result).length - 1; i++) {
                let user = result[i];
                // Find logged in
                if (user['active']) {
                    nickname = user['name'];
                    console.log("active");

                }
            }
            var nicknameElement = document.getElementById("nickname");
            if (nicknameElement) {
                console.log(nickname);
                nicknameElement.textContent = nickname || "N/A"; // Default
            }
        });
    }
}
