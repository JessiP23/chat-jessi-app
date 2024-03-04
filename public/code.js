// code.js
(function(){

    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    const usernameInput = document.getElementById('username');

    // Update the selector to match the form id in your HTML
    const joinForm = document.getElementById('joinForm');
    
    joinForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = usernameInput.value;

        // Check if a username is provided
        if (!username || username.trim() === "") {
            alert("Please enter a valid username");
            return;
        }

        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove('active');
        app.querySelector('.chat-screen').classList.add('active');
    });

    app.querySelector('.chat-screen #send-message').addEventListener('click', function(){
        let message = app.querySelector(".chat-screen #message-input").value;
        if(message.length == 0){
            return;
        }
        renderMessage('my', {
            username: uname,
            text: message
        });
        socket.emit('chat', {
            username:uname,
            text: message
        });
        app.querySelector('.chat-screen #message-input').value = "";
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){
        socket.emit('exituser', uname);
        window.location.reload();
    });

    socket.on("update", function(update){
        renderMessage("update", update);
    });
    socket.on("chat", function(message){
        renderMessage("other", message);
    });

    function renderMessage(type, message){
        let messageContainer = app.querySelector(".chat-screen .messages");
        if(type == "my"){
            let el = document.createElement('div');
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
            <div>
                <div class="name">You</div>
                <div class="text">${message.text}</div>
            </div>
            `;
            messageContainer.appendChild(el);
        } else if(type == "other"){
            let el = document.createElement('div');
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
            <div>
                <div class="name">${message.username}</div>
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
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();
