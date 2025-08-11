import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect} from "react";
import { UserContext } from "./UserContext";
import VerticalNavBar from "./components/VerticalNavBar";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Header() {
  const {setUserInfo, userInfo} = useContext(UserContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetch(`${backendUrl}/profile`, {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch (`${backendUrl}/logout`, {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
    navigate('/');
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">Bookies</Link>
      <nav>
        {username && (
          <>
            <VerticalNavBar />
            <Link to="/create" className="button-home">Create new book</Link>
            <a onClick={logout} className="button-home">Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login" className="button-header">Login</Link>
            <Link to="/register" className="button-header">Register</Link>
          </>
        )}
      </nav>
    </header> 
  );
}