import { Routes, Route, BrowserRouter } from "react-router"
import './App.css';
import Nav from './components/Nav';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat'
import ChatList from "./components/ChatList";
import UserList from "./components/UserList";
import ChatEdit from "./components/ChatEdit";
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Nav />}>
            <Route index element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="chat/:id" element={<Chat />} />
            <Route path="chat/:id/edit" element={<ChatEdit />} />
            <Route path="users" element={<UserList />} />
            <Route path="chats" element={<ChatList />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
