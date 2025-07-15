import React, {useState} from "react";
import { Link } from "react-router-dom";
import ChatBox from "./ChatBox"

const VerticalNavBar = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
    <div className="vertical-navbar">
      <Link to="/Profile" className="nav-link">
            <img src="/profile.png" alt="Profile icon" className="nav-icon"/>
            <span>Profile</span>
      </Link>
      <Link to="/friends" className="nav-link">
        <img src="/friends.png" alt="Friend icon" className="nav-icon"/>
        <span>Friends</span>
      </Link>
      <Link to="/list" className="nav-link">
        <img src="/star.png" alt="star icon" className="nav-icon"/>
        <span>List</span>
      </Link>
      <button onClick={() => setShowChat(!showChat)} className="chat-nav-link">
        <img src="/chat.png" alt="Chat icon" className="nav-icon"/>
        <span>Chat</span>
      </button>
    </div>
    <div className={`chat ${showChat ? "open-chat" : ""}`}>
      <div className="chat-header">
        <h2>Bookbot</h2>
        <button onClick={() => setShowChat(false)} className="close-chat-button">✖</button>
      </div>
      <div className="chat-content">
        <ChatBox/>
      </div>
    </div>
    </>
  );
};

export default VerticalNavBar;
