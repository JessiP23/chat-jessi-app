document.addEventListener('DOMContentLoaded', function(){
    const app = document.querySelector(".app");
    const socket = io();
    const urlParams = new URLSearchParams(window.location.search);
    const uname = localStorage.getItem('username');

    if (!uname){
        window.location.href = '/login';
        return;
    }

    const welcomeMessage = document.getElementById("welcome-message");
    welcomeMessage.innerText = `Welcome ${uname}`;

    const joinButton = document.querySelector('.joinButton');
    const joinScreen = app.querySelector(".join-screen");
    const chatScreen = app.querySelector(".chat-screen");

    app.querySelector(".join-screen").classList.add('active');

    joinButton.addEventListener('click', function () {
        joinScreen.classList.remove('active');
        chatScreen.classList.add('active');
    });



    app.querySelector('.chat-screen #send-message').addEventListener('click', function(){
        let message = app.querySelector(".chat-screen #message-input").value;
        if(message.length == 0){
            return;
        }

        renderMessage('chat', {
            username: uname,
            text: message
        });

        socket.emit('chat', {
            username: uname,
            text: message
        });

        app.querySelector('.chat-screen #message-input').value = "";
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){
        // Emit the exituser event with the username
        socket.emit('exituser', uname);

        // Reload the page
        window.location.reload();
    });

    // Event listener for incoming chat messages
    socket.on("chat", function(message){
        // Render the incoming message
        renderMessage("other", message);
    });

    // Event listener for updates (join/exit messages)
    socket.on("update", function(update){
        // Render the update message
        renderMessage("update", update);
    });

    function renderMessage(type, message){
        let messageContainer = app.querySelector(".chat-screen .messages");
        const senderUsername = message.username;

        if(type === "my"){
            let el = document.createElement('div');
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
            <div>
                <div class="name">${senderUsername}</div>
                <div class="text">${message.text}</div>
            </div>
            `;
            messageContainer.appendChild(el);
        } else if(type == "other"){
            let el = document.createElement('div');
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
            <div>
                <div class="name">${senderUsername}</div>
                <div class="text">${message.text}</div>
            </div>
            `;
            messageContainer.appendChild(el);
        } else if(type == "update"){
            let el = document.createElement('div');
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
});
