import './App.css';
import Post from './Post';
import Header from './Header';
import Layout from './Layout';
import {Route, Routes} from "react-router-dom"
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProfilePage from './ProfilePage';
import { UserContextProvider } from './UserContext';
import CreateBook from './CreateBook';
import PostPage from './PostPage';
import EditPost from './EditPost';
import ListPage from './ListPage';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path = "/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element = {<LoginPage />} />
          <Route path="/Register" element = {<RegisterPage/>}/>
          <Route path="/Create" element = {<CreateBook />}/>
          <Route path="/profile" element = {<ProfilePage/>}/>
          <Route path="/post/:id" element = {<PostPage/>}/>
          <Route path="/edit/:id" element = {<EditPost/>}/>
          <Route path="/list" element = {<ListPage/>}/>
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
