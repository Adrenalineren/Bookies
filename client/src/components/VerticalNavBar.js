import React, {useState} from "react";
import { Link, useLocation} from "react-router-dom";
import ChatBox from "./ChatBox"

const VerticalNavBar = () => {
  const [showChat, setShowChat] = useState(false);
  const location = useLocation();
  //To switch icons to shaded/unshaded

  const getIcon = (path, shaded, unshaded) => {
    return location.pathname === path ? unshaded : shaded;
  }

  return (
    <>
    <div className="vertical-navbar">
      <Link to="/Profile" className="nav-link">
          <div className="icon-circle">
          <img src={getIcon("/Profile", "/user-unshaded.png", "/user-shaded.png")} 
          alt="Profile icon" 
          className="nav-icon"/>
          </div>
      </Link>
      <Link to="/friends" className="nav-link">
        <div className="icon-circle">
        <img 
        src={getIcon("/friends", "/friends-unshaded.png", "/friends-shaded.png")} 
        alt="Friend icon" 
        className="nav-icon"/>
        </div>
      </Link>
      <Link to="/list" className="nav-link">
        <div className="icon-circle">
        <img src={getIcon("/list", "/star-unshaded.png", "/star-shaded.png")}  
        alt="star icon" 
        className="nav-icon"/>
        </div>
      </Link>
      <button onClick={() => setShowChat(!showChat)} className="chat-nav-link">
        <div className="icon-circle">
        <img src={showChat ? "/chat-shaded.png" : "/chat-unshaded.png"} 
        alt="Chat icon" 
        className="nav-icon"/>
        </div>
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
