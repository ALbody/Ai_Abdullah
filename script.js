const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessage = document.querySelector(".send-button");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const chatbotPopup = document.querySelector(".chat-container");
const closeChatbot = document.querySelector("#close-chatbot");

const API_KEY = "AIzaSyCHC3N4D_q1sAKfrGzTRk6KtNaAsgEP53c";  // استبدل هذا بـ API Key الخاص بك
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

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

const generateBotResponse = async (userMessage) => {
  const textDiv = createMessageElement("...", "bot-message");
  chatBody.appendChild(textDiv);
  chatBody.scrollTop = chatBody.scrollHeight;

  // إضافة رسالة المستخدم إلى تاريخ الدردشة
  chatHistory.push({ role: "user", parts: [{ text: userMessage }] });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: chatHistory }),
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

    // عرض الرد في واجهة الدردشة
    textDiv.querySelector(".message-text").innerText = reply;

    // إضافة رد البوت إلى تاريخ الدردشة
    chatHistory.push({ role: "model", parts: [{ text: reply }] });
  } catch (err) {
    textDiv.querySelector(".message-text").innerText = "Error: " + err.message;
  }
};

const handleSend = (e) => {
  e.preventDefault();
  const userMessage = messageInput.value.trim();
  if (!userMessage) return;
  messageInput.value = "";

  const userMsgElement = createMessageElement(userMessage, "user-message");
  chatBody.appendChild(userMsgElement);
  chatBody.scrollTop = chatBody.scrollHeight;

  generateBotResponse(userMessage);  // ارسال رسالة المستخدم إلى API للرد من البوت
};

sendMessage.addEventListener("click", handleSend);

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    handleSend(e);
  }
});

chatbotToggler.addEventListener("click", () => {
  chatbotPopup.style.display = chatbotPopup.style.display === "none" ? "flex" : "none";
});

closeChatbot.addEventListener("click", () => {
  chatbotPopup.style.display = "none";
});
