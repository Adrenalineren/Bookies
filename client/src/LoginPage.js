import { useContext } from "react";
import {useState} from "react";
import {Link, Navigate} from "react-router-dom";
import { UserContext } from "./UserContext";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);

    async function login(ev) {
        ev.preventDefault();
        const response = await fetch ('http://localhost:4000/login', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type' : 'application/json'},
            credentials: 'include', 
        });
        if (response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            });
        } else {
            alert('Wrong credentials');
        }
    }
    if (redirect) {
        return <Navigate to={'/'} />
    }
    return (
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <label>Username</label>
            <input type="text" 
                placeholder="Enter your username"
                value = {username}
                onChange = {ev => setUsername(ev.target.value)} 
            />
            <label>Password</label>
            <input type="password" 
                placeholder="Enter your password" 
                value = {password}
                onChange = {ev => setPassword(ev.target.value)} 
            />
            <button className="button-hover">Login</button>
            <span className="signup-text">Don't have an account? 
                <Link to="/register" className="signup-link"> Sign Up</Link>
            </span>
        </form>
    );
}