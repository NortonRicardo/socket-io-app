const socket = io();

const urlSearch = new URLSearchParams(window.location.search);

const username = urlSearch.get("username");
const room = urlSearch.get("select_room");

let user = new Object();

function createMessage({ text, userSender: { username: senderUsername }, created_at }) {
  const messagesDiv = document.getElementById("messages");

  const messageClass = senderUsername === username ? 'sent' : 'received';

  messagesDiv.innerHTML += `
  <div class="message ${messageClass}">
    <label class="form-label">
        <strong>${senderUsername}: </strong> <span>${text}</span> 
    </label>
  </div>
  `;
}

document.getElementById(
  "username"
).innerHTML = `Olá ${username} - Você está na sala: ${room}`;

socket.emit(
  "select_room",
  {
    username,
    room,
  },
  (messages, data) => {
    user = data;

    messages.forEach((message) => {
      createMessage(message);
    });
  }
);

document
  .getElementById("message_input")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const text = event.target.value;

      const data = {
        room,
        text,
        userSenderId: user.id,
      };

      event.target.value = "";

      socket.emit("message", data);
    }
  });

socket.on("message", (messages) => {
  document.getElementById("messages").innerHTML = "";

  messages.forEach((message) => {
    createMessage(message);
  });
});

document.getElementById("logout").addEventListener("click", () => {
  socket.emit("logout", { userId: user.id });

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
});
