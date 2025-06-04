import React from "react";

const VerticalNavBar = () => {
  return (
    <div className="vertical-navbar">
      <a href="#home" className="nav-link">
            <img src="/home.png" alt="Home icon" className="nav-icon"/>
            <span>Home</span>
        </a>
      <a href="#friends" className="nav-link">
        <img src="/friends.png" alt="Friend icon" className="nav-icon"/>
        <span>Friends</span>
      </a>
      <a href="#list" className="nav-link">
        <img src="/star.png" alt="star icon" className="nav-icon"/>
        <span>List</span>
      </a>
    </div>
  );
};

export default VerticalNavBar;
