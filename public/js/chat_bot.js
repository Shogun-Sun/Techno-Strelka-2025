const socket = io('http://localhost:3000');
const chat = document.getElementById('chat');
const input = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

let typingIndicator = null;
let isSending = false; // Флаг для отслеживания состояния отправки

socket.on('connect', () => {
  console.log('Connected to socket server');
});

socket.on('message', (data) => {
  if (data.sender === 'Tele2Bot') {
    if (typingIndicator) {
      typingIndicator.remove();
      typingIndicator = null;
    }
    if (data.redirect) {
      appendBotMessage(data.message);
      setTimeout(() => {
        appendBotMessage(`Перейдите по следующей ссылке: <a href="https://lk.t2.ru/lk" target="_blank" class="text-pink-600 underline">https://lk.t2.ru/lk</a>`);
      }, 2000); 
      return;
    }
    appendBotMessage(data.message);
  } 
});

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  if (isSending) return; 
  const message = input.value.trim();
  if (message) {
    isSending = true;
    appendUserMessage(message);
    showTypingIndicator();
    input.value = '';
    socket.emit('message', { sender: 'User', message }, () => {
      isSending = false; 
    });
    isSending = false;
  }
}

function appendUserMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'flex justify-end mb-4';
  messageDiv.innerHTML = `
    <div class="bg-pink-600 text-white rounded-xl px-4 py-2 max-w-xs md:max-w-md">
      <p class="font-medium font-Halvar">Вы</p>
      <p class="font-Rooftop">${text}</p>
    </div>
  `;
  chat.appendChild(messageDiv);
  scrollToBottom();
}

function appendBotMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'flex justify-start mb-4';
  messageDiv.innerHTML = `
    <div class="bg-gray-100 text-black rounded-xl px-4 py-2 max-w-xs md:max-w-md">
      <p class="font-medium font-Halvar">Tele2Bot</p>
      <p class="font-Rooftop">${text}</p>
    </div>
  `;
  chat.appendChild(messageDiv);
  scrollToBottom();
}

function showTypingIndicator() {
  if (typingIndicator) {
    typingIndicator.remove();
  }
  typingIndicator = document.createElement('div');
  typingIndicator.className = 'flex justify-start mb-4';
  typingIndicator.innerHTML = `
    <div class="bg-gray-100 text-gray-500 italic rounded-xl px-4 py-2">
      <p>Tele2Bot печатает...</p>
    </div>
  `;
  chat.appendChild(typingIndicator);
  scrollToBottom();
}

function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
}
