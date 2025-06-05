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
      <input type="text" 
        placeholder="username" 
        value={username} 
        onChange={ev => setUsername(ev.target.value)} />
      <input type="password" 
        placeholder="password" 
        value={password}
        onChange={ev => setPassword(ev.target.value)}
        required
        minLength={4}
        />
      <button>Register</button>
    </form>
  );
}
