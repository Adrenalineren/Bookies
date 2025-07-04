import { useState } from "react";
const ChatBox = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = () => {
        if(!input.trim()) return;

        const newMessages = [...messages, {sender: "user", text:input}];
        setMessages(newMessages);
        setInput("");

        setTimeout(() => {
            setMessages((prev) => [...prev, {sender: "bot", text:"Heres a book"}]);

        }, 500);
    }


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

