
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message");
const subjectSelect = document.getElementById("subject");
const sendButton = document.getElementById("send-btn");

async function sendMessage() {
  const message = messageInput.value.trim();
  const subject = subjectSelect.value;

  if (!message) {
    alert("Please enter your question!");
    return;
  }

  addMessage(message, "user-message");

  messageInput.value = "";
  sendButton.disabled = true;
  sendButton.textContent = "Thinking...";

  const loading = addMessage("Emmzy AI is thinking...", "bot-message");

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message,
        subject: subject
      })
    });

    const data = await response.json();

    loading.remove();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    addMessage(data.reply, "bot-message");

  } catch (error) {
    loading.remove();
    addMessage(
      "Sorry! I could not connect to the AI tutor. Please try again.",
      "bot-message"
    );

    console.error(error);

  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "Send";
    messageInput.focus();
  }
}

function addMessage(text, className) {
  const messageElement = document.createElement("div");

  messageElement.className = className;
  messageElement.textContent = text;

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;

  return messageElement;
}

messageInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
