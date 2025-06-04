import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import VerticalNavBar from "./components/VerticalNavBar";


export default function Header() {
  const {setUserInfo, userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch ('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">Bookies</Link>
      <nav>
        {username && (
          <>
            <VerticalNavBar />
            <Link to="/create">Create new book</Link>
            <a onClick={logout} >Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header> 
  );
}