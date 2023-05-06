const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", async () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addMessage(userMessage, "user");
        userInput.value = "";
        const aiMessage = await getAIResponse(userMessage);
        addMessage(aiMessage, "ai");
    }
});

function addMessage(message, sender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.classList.add(sender === "user" ? "user-message" : "ai-message");
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function getAIResponse(message) {
    const api_key = "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";
    const prompt = `人間: ${message}\nAI: `;

    const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${api_key}`
        },
        body: JSON.stringify({
            prompt: prompt,
            max_tokens: 50,
            n: 1,
            stop: null,
            temperature: 0.7
        })
    });

    const data = await response.json();
    return data.choices[0].text.trim();
}
