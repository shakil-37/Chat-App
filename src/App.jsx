import "./App.css";
import { Route, Routes } from "react-router-dom";
import Forgetpassword from "./components/Forgetpassword";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Home from "./components/Home";
import Group from "./components/Group";
import Userlist from "./components/Userlist";
import Message from "./components/Message";
import Friends from "./components/Friends";
import Settings from "./components/Settings";
import Profilemodal from "./components/Profilemodal";
import Errorpage from "./components/Errorpage";
import FriendRequest from "./components/FriendRequest";
import BlockList from "./components/BlockList";
//
function App() {
  //
  return (
    <div>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgetpassword" element={<Forgetpassword />} />
        <Route path="/friendrequest" element={<FriendRequest />} />
        <Route path="/home" element={<Home />} />
        <Route path="/group" element={<Group />} />
        <Route path="/userlist" element={<Userlist />} />
        <Route path="/message" element={<Message />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/blocklist" element={<BlockList />} />
        <Route path="/profilemodal" element={<Profilemodal />} />
        <Route path="*" element={<Errorpage />} />
      </Routes>
    </div>
  );
  //
}

export default App;
