const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessage = document.querySelector("#send-message");
const whatsappButton = document.querySelector("#whatsapp-button");

const API_KEY = "AIzaSyDO55ckTtjFGF3Miar39fUppsJv29K9XDk";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = {
  message: null,
};

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

  // إرسال الرسالة إلى البوت مع تحديد اللغة
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            language_code: "ar",  // تحديد أن الرسالة بالعربية
            parts: [{ text: userData.message }],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("حدث خطأ أثناء الاتصال بـ API.");
    }

    const data = await response.json();
    // الرد من البوت بالإنجليزية
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "لا يوجد رد.";
    textDiv.innerText = reply;
  } catch (err) {
    textDiv.innerText = `خطأ: ${err.message}`;
  }
};

const handleSend = (e) => {
  e.preventDefault();
  userData.message = messageInput.value.trim();
  if (!userData.message) return;
  messageInput.value = "";
  const msg = createMessageElement(userData.message, "user-message");
  chatBody.appendChild(msg);

  const botMsg = createMessageElement("جارٍ التحميل...", "bot-message");
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
  const phone = "201019890771";
  window.open(`https://wa.me/${phone}`, "_blank");
});
