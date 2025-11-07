document.getElementById('sendBtn').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const chatBody = document.getElementById('chatBody');
    const text = input.value.trim();
    const userId = 1; // ⚠️ Hardcoded for now; later use token decode

    if (!text) return;

    // Show instantly on UI
    const msg = document.createElement('div');
    msg.className = 'message sent';
    msg.innerHTML = `${text}<div class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
    input.value = '';

    // Save to DB
    try {
        const res = await fetch('/api/chat/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, message: text })
        });

        const result = await res.json();
        if (!res.ok) {
            alert(result.message || 'Failed to save message');
        }
    } catch (err) {
        console.error('Error sending message:', err);
    }
}

// (Optional) Load messages when page loads
window.onload = async () => {
    try {
        const res = await fetch('/api/chat/messages');
        const messages = await res.json();
        const chatBody = document.getElementById('chatBody');
        chatBody.innerHTML = '';

        messages.forEach(m => {
            const div = document.createElement('div');
            div.className = m.userId === 1 ? 'message sent' : 'message received';
            div.innerHTML = `${m.message}<div class="timestamp">${new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;
            chatBody.appendChild(div);
        });

        chatBody.scrollTop = chatBody.scrollHeight;
    } catch (err) {
        console.error('Error loading messages:', err);
    }
};
