const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessage = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");
const whatsappButton = document.querySelector("#whatsapp-button");

const API_KEY = "AIzaSyCHC3N4D_q1sAKfrGzTRk6KtNaAsgEP53c";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = {
  message: null,
  file: {},
};
const chatHistory = [];

const createMessageElement = (content, classes, isImage = false) => {
  const div = document.createElement("div");
  div.classList.add("message", classes);
  const text = document.createElement("div");
  text.className = "message-text";
  
  if (isImage) {
    const img = document.createElement("img");
    img.src = content;
    img.alt = "User uploaded image";
    img.style.maxWidth = "100%";
    text.appendChild(img);
  } else {
    text.innerHTML = content;
  }

  div.appendChild(text);
  return div;
};

const generateBotResponse = async (messageDiv) => {
  const textDiv = messageDiv.querySelector(".message-text");
  chatHistory.push({
    role: "user",
    parts: [{ text: userData.message }, ...(userData.file.data ? [{ inline_data: userData.file }] : [])],
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
    textDiv.innerText = "Error: Unable to reach the API. Please try again later.";
    console.error("Error:", err);
  }
};

const handleSend = (e) => {
  e.preventDefault();
  userData.message = messageInput.value.trim();
  if (!userData.message && !userData.file.data) return;

  messageInput.value = "";
  const msg = createMessageElement(userData.message || "Image/File uploaded", "user-message", !!userData.file.data);
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

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    userData.file = {
      data: e.target.result.split(",")[1],
      mime_type: file.type,
    };
    const img = fileUploadWrapper.querySelector("img");
    img.src = e.target.result;
    img.style.display = "block";
    fileCancelButton.style.display = "block";
  };
  reader.readAsDataURL(file);
});

fileCancelButton.addEventListener("click", () => {
  userData.file = {};
  fileUploadWrapper.querySelector("img").style.display = "none";
  fileCancelButton.style.display = "none";
});

whatsappButton.addEventListener("click", () => {
  const phone = "201019890771";
  window.open(`https://wa.me/${phone}`, "_blank");
});
