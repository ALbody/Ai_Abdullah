const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessage = document.querySelector("#send-message");
const whatsappButton = document.querySelector("#whatsapp-button");

const API_KEY = "AIzaSyDO55ckTtjFGF3Miar39fUppsJv29K9XDk";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = { message: null };

const createMessageElement = (content, className) => {
  const div = document.createElement("div");
  div.classList.add("message", className);
  const text = document.createElement("div");
  text.className = "message-text";
  text.innerText = content;
  div.appendChild(text);
  return div;
};

const generateBotResponse = async (botMsg) => {
  const textDiv = botMsg.querySelector(".message-text");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userData.message }],
          },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "لا يوجد رد.";
    textDiv.innerText = reply;
  } catch (error) {
    textDiv.innerText = "حدث خطأ أثناء الاتصال بالخادم.";
  }
};

const handleSend = (e) => {
  e.preventDefault();
  userData.message = messageInput.value.trim();
  if (!userData.message) return;

  const userMsg = createMessageElement(userData.message, "user-message");
  chatBody.appendChild(userMsg);
  messageInput.value = "";

  const botMsg = createMessageElement("جاري التفكير...", "bot-message");
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

whatsappButton.addEventListener("click", () => {
  window.open("https://wa.me/201019890771", "_blank");
});
