import './App.css';
import Post from './Post';
import Header from './Header';
import Layout from './Layout';
import {Route, Routes} from "react-router-dom"
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import { UserContextProvider } from './UserContext';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path = "/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path ={'/login'} element = {<LoginPage />} />
          <Route path ={'/Register'} element = {<RegisterPage/>}/>
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
