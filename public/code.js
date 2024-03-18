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
    
    if (welcomeMessage) {
        welcomeMessage.innerText = `Welcome ${uname}`;
    }

    const joinButton = document.querySelector('.joinButton');
    const joinScreen = app.querySelector(".join-screen");
    const chatScreen = app.querySelector(".chat-screen");

    app.querySelector(".join-screen").classList.add('active');

    joinButton.addEventListener('click', function () {
        joinScreen.classList.remove('active');
        chatScreen.classList.add('active');
    });



    const sendMessageButton = app.querySelector('.chat-screen #send-message');
    if (sendMessageButton){
        sendMessageButton.addEventListener('click', function() {
            let messageInput = app.querySelector(".chat-screen #message-input");
            let message = messageInput.value.trim();

            if(message.length == 0){
                return;
            }

            renderMessage('my', {
                username: uname,
                text: message,
            });

            socket.emit('chat', {
                username: uname,
                text: message,
            });
            
            app.querySelector('.chat-screen #message-input').value = "";
        });
    }

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){
        socket.emit('exituser', uname);

        window.location.reload();
    });

    socket.on("chat", function(message){
        renderMessage("other", message);
    });

    socket.on("update", function(update){
        renderMessage("update", update);
    });

    function renderMessage(type, message){
        let messageContainer = app.querySelector(".chat-screen .messages");
        const senderUsername = message.username;

        if(type === "my" || type === 'other'){
            let el = document.createElement('div');
            el.setAttribute("class", `message ${type === 'my' ? 'my-message' : 'other-message'}`);
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
