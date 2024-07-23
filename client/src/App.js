import './App.css';
import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
} from "react-router-dom";
import { AuthContext } from './auth';
import Groups from "./groups/Groups";
import Group from "./groups/Group";
import AddGroup from "./groups/AddGroup";
import Profile from "./profile/Profile";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Logout from "./auth/Logout";

function App() {
  const { username, token } = useContext(AuthContext)
  return (
    <Router>
      <nav style={{ margin: 10 }}>
        <Link to="/groups" style={{ padding: 5 }}>
          Groups
        </Link>
        {username ?
          <Link to="/profile" style={{ padding: 5 }}>
            Profile
          </Link> :
          <Link to="/register" style={{ padding: 5 }}>
            Register
          </Link>
        }
        {username ?
          <Link to="/logout" style={{ padding: 5 }}>
            Logout
          </Link> :
          <Link to="/login" style={{ padding: 5 }}>
            Login
          </Link>
        }

      </nav>
      <Routes>
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:id" element={<Group />} />
        <Route path="/groups/add" element={<AddGroup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

      </Routes>
    </Router>
  );
}

export default App;
