document.addEventListener('DOMContentLoaded', function(){
    const app = document.querySelector(".app");
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
});
