import { useState } from "react";
const ChatBox = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        if(!input.trim()) return;

        const newMessages = [...messages, {sender: "user", text:input}];
        setMessages(newMessages);
        setInput("");

        try {
            const response = await fetch("http:////localhost:4000/chat",{
                method:"POST",
                headers : {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({messages:input}),
            });
            const data = await response.json();
            setMessages((prev) => [...prev, {sender: "bot", text:data.reply}]);

        } catch (error) {
            setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, no response." }]);
            console.error("Error calling backend:", error);
        }

    };


    return (
    <div className="chatbox-container">
        <div className="chatbox-messages">
            {messages.map((msg,index) => (
                <div
                    key={index}
                    className={`chatbox-message ${msg.sender === "user" ? "user" : "bot"}`}
                >
                    {msg.text}
                </div>
            ))}
        </div>
        <div className="chatbox-input-container">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about a book"
                className="chatbox-input"
            />
            <button onClick={sendMessage} className="chatbox-send-button">➤</button>
        </div>
    </div>
)
};

export default ChatBox;

