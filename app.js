const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Replace with your actual Gemini API key
const GEMINI_API_KEY = "AIzaSyDs7R68xZwSRW3y_1dAg1qi08AaiN3rxDI";

// Maintain conversation history
let conversationHistory = [];

function addMessage(message, className, isHTML = false) {
    const messageElement = document.createElement('div');
    messageElement.className = className;
    
    if (isHTML) {
        messageElement.innerHTML = message; // Allows formatted output
    } else {
        messageElement.textContent = message;
    }

    messageElement.style.textAlign = (className === 'user-message') ? "right" : "left"; // User messages right-aligned, bot messages left-aligned
    messageElement.style.padding = "10px";
    messageElement.style.margin = "5px 0";
    messageElement.style.borderRadius = "10px";
    messageElement.style.maxWidth = "80%";
    messageElement.style.fontFamily = "'Poppins', sans-serif";

    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to the bottom
}

// Function to format response properly
function formatResponse(text) {
    if (!text) return "I'm sorry, I didn't understand.";

    // Convert bullet points or lists to proper HTML formatting
    text = text
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold text
        .replace(/\n- /g, '<br>➡️ ') // Convert bullet points
        .replace(/\n\d+\./g, match => `<br>${match.trim()}`) // Numbered lists
        .replace(/\n/g, '<br>'); // Ensure each new line starts properly

    // Detect and format code blocks
    if (text.includes("```")) {
        text = text.replace(/```(.*?)```/gs, (match, code) => {
            return `<pre style="background-color: #222; color: #fff; padding: 10px; border-radius: 5px; overflow-x: auto;">
                <code>${escapeHTML(code)}</code>
            </pre>`;
        });
    }

    return text;
}

// Escape HTML to prevent issues in rendering
function escapeHTML(text) {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function getAIResponse(userMessage) {
    conversationHistory.push({ role: "user", parts: [{ text: userMessage }] }); // Store user message

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const requestData = { contents: conversationHistory };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        console.log("API Response:", data);

        let botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I didn't understand.";

        // Format response properly
        botResponse = formatResponse(botResponse);

        // Store formatted bot response in history
        conversationHistory.push({ role: "model", parts: [{ text: botResponse }] });

        return botResponse;
    } catch (error) {
        console.error("Error:", error);
        return "Error connecting to AI. Please check your API key or internet connection.";
    }
}

sendBtn.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage(`You: ${userMessage}`, 'user-message');
    userInput.value = '';

    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chatbot-message';
    typingIndicator.textContent = "Bot is typing...";
    chatbox.appendChild(typingIndicator);
    chatbox.scrollTop = chatbox.scrollHeight;

    const botResponse = await getAIResponse(userMessage);
    chatbox.removeChild(typingIndicator);
    addMessage(`Bot: ${botResponse}`, 'chatbot-message', true);
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});
