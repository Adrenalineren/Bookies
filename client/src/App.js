import './App.css';
import Post from './Post';
import Header from './Header';
import Layout from './Layout';
import {Route, Routes} from "react-router-dom"
import HomePage from './HomePage';

function App() {
  return (
    <Routes>
      <Route path = "/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path ={'/login'} element = {<div>login page</div>} />
      </Route>
    </Routes>
  );
}

export default App;
