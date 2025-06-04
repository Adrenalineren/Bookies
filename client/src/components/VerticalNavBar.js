import React from "react";
import { Link } from "react-router-dom";

const VerticalNavBar = () => {
  return (
    <div className="vertical-navbar">
      <Link to="/Profile" className="nav-link">
            <img src="/profile.png" alt="Profile icon" className="nav-icon"/>
            <span>Profile</span>
        </Link>
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
