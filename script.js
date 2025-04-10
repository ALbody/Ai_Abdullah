const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessage = document.querySelector("#send-message");
const API_KEY = "AIzaSyCHC3N4D_q1sAKfrGzTRk6KtNaAsgEP53c";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = {
  message: null,
};

const chatHistory = [];

const createMessageElement = (content, classes) => {
  const div = document.createElement("div");
  div.classList.add("message", classes);
  const text = document.createElement("div");
  text.className = "message-text";
  text.innerHTML = content;
  div.appendChild(text);
  return div;
};

const generateBotResponse = async (messageDiv) => {
  const textDiv = messageDiv.querySelector(".message-text");
  chatHistory.push({
    role: "user",
    parts: [{ text: userData.message }],
  });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: chatHistory }),
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    textDiv.innerText = reply;
    chatHistory.push({ role: "model", parts: [{ text: reply }] });
  } catch (err) {
    textDiv.innerText = "Error: " + err.message;
  }
};

const handleSend = (e) => {
  e.preventDefault();
  userData.message = messageInput.value.trim();
  if (!userData.message) return;
  messageInput.value = "";
  const msg = createMessageElement(userData.message, "user-message");
  chatBody.appendChild(msg);

  const botMsg = createMessageElement("...", "bot-message");
  chatBody.appendChild(botMsg);
  chatBody.scrollTop = chatBody.scrollHeight;

  generateBotResponse(botMsg);
};

sendMessage.addEventListener("click", handleSend);

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    handleSend(e);
  }
});
