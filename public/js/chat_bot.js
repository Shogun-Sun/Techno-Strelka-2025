const socket = io('http://localhost:3000');
const chat = document.getElementById('chat');
const input = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

let typingIndicator = null;

socket.on('connect', () => {});

socket.on('message', (data) => {
  if (data.sender === 'Tele2Bot') {
    if (typingIndicator) {
      typingIndicator.remove();
      typingIndicator = null;
    }
  }
  appendMessage(`${data.sender}: ${data.message}`);
});

sendBtn.addEventListener('click', () => {
  const message = input.value.trim();
  if (message) {
    socket.emit('message', { sender: 'User', message });
    input.value = '';

    if (typingIndicator) {
      typingIndicator.remove();
    }

    typingIndicator = document.createElement('p');
    typingIndicator.textContent = 'Tele2Bot печатает...';
    typingIndicator.classList.add('typing');
    chat.appendChild(typingIndicator);
    chat.scrollTop = chat.scrollHeight;
  }
});

function appendMessage(text) {
  const p = document.createElement('p');
  p.textContent = text;
  chat.appendChild(p);
  chat.scrollTop = chat.scrollHeight;
}
