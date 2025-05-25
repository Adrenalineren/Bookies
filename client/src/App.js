import './App.css';
import Post from './Post';
import Header from './Header';
import Layout from './Layout';
import {Route, Routes} from "react-router-dom"
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

function App() {
  return (
    <Routes>
      <Route path = "/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path ={'/login'} element = {<LoginPage />} />
        <Route path ={'/Register'} element = {<RegisterPage/>}/>
      </Route>
    </Routes>
  );
}

export default App;
