document.getElementById('sendBtn').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const input = document.getElementById('messageInput');
    const chatBody = document.getElementById('chatBody');
    const text = input.value.trim();
    if (!text) return;

    const msg = document.createElement('div');
    msg.className = 'message sent';
    msg.innerHTML = `${text}<div class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;

    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
    input.value = '';
}
