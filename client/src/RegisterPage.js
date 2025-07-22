import {useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUserInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  async function register(ev){


    ev.preventDefault();
    const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        body: JSON.stringify({username,password}),
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
    });
    if (response.status === 200){
        response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            });
    } else {
        alert('Registation failed');
    }
  }
  if (redirect) {
      return <Navigate to={'/'} />
  }
  
  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <label>Username</label>
      <input type="text" 
        placeholder="Enter your username" 
        value={username} 
        onChange={ev => setUsername(ev.target.value)} />
      <label>Password</label>
      <input type="password" 
        placeholder="Enter your password" 
        value={password}
        onChange={ev => setPassword(ev.target.value)}
        required
        minLength={4}
        />
      <button className="button-hover">Register</button>
    </form>
  );
}
