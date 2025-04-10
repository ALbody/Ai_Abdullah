const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessage = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = fileUploadWrapper.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");
const whatsappButton = document.querySelector("#whatsapp-button");

const API_KEY = "AIzaSyCHC3N4D_q1sAKfrGzTRk6KtNaAsgEP53c";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = {
  message: null,
  file: {
    data: null,
    mime_type: null,
  },
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

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    textDiv.innerText = reply;
    chatHistory.push({
      role: "model",
      parts: [{ text: reply }],
    });
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

// Handle file input change and preview the selected file
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    fileInput.value = "";
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");
    const base64String = e.target.result.split(",")[1];

    // Store file data in userData
    userData.file = {
      data: base64String,
      mime_type: file.type,
    };
  };

  reader.readAsDataURL(file);
});

// Cancel file upload
fileCancelButton.addEventListener("click", () => {
  userData.file = {};
  fileUploadWrapper.classList.remove("file-uploaded");
});

sendMessage.addEventListener("click", handleSend);

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    handleSend(e);
  }
});

// WhatsApp button click event
whatsappButton.addEventListener("click", () => {
  const phone = "201019890771";
  window.open(`https://wa.me/${phone}`, "_blank");
});

// Emoji picker initialization (Optional, add if needed for emojis)
const picker = new EmojiMart.Picker({
  theme: "light",
  skinTonePosition: "none",
  previewPosition: "none",
  onEmojiSelect: (emoji) => {
    const { selectionStart: start, selectionEnd: end } = messageInput;
    messageInput.setRangeText(emoji.native, start, end, "end");
    messageInput.focus();
  },
  onClickOutside: (e) => {
    if (e.target.id === "emoji-picker") {
      document.body.classList.toggle("show-emoji-picker");
    } else {
      document.body.classList.remove("show-emoji-picker");
    }
  },
});

document.querySelector(".chat-form").appendChild(picker);

// Toggle chatbot visibility
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
