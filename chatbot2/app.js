// Simulate chatbot responses
document.querySelectorAll('.quick-replies button').forEach(button => {
    button.addEventListener('click', () => {
        const chatWindow = document.querySelector('.chat-window');
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user';
        userMessage.innerHTML = `<p>${button.textContent}</p>`;
        chatWindow.appendChild(userMessage);

        const botMessage = document.createElement('div');
        botMessage.className = 'chat-message bot';
        botMessage.innerHTML = `<p>Processing your request...</p>`;
        chatWindow.appendChild(botMessage);

        chatWindow.scrollTop = chatWindow.scrollHeight;
    });
});
