window.addEventListener('load', () => {
    $('#nicknameInput').val(name);
    document.getElementById('nicknameForm').addEventListener('submit', function (event) {
        event.preventDefault();
        var nameinput = $('#nicknameInput').val();
        document.getElementById('nicknameInput').value;
        // Whether to login or register
        if (nameinput.length > 3) {
            changeName(nameinput)
        }
        // redirect to home page
        window.location.href = "/";
    });
})