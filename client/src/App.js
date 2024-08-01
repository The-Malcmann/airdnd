import './App.css';
import React, { useState, useEffect } from 'react';
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
import BottomNav from "./BottomNav"
import Header from "./Header"

function App() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 650);
  
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 743);
    };

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsNavbarVisible(currentScrollY <= lastScrollY);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Header isLargeScreen={isLargeScreen}/>
        <BottomNav isVisible={isNavbarVisible} isLargeScreen={isLargeScreen} />
        <main>
          <Routes>
            <Route path="/" element={<Groups />} />
            <Route path="/groups/:id" element={<Group />} />
            <Route path="/groups/add" element={<AddGroup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
