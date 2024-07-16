import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';

function App() {
  const [username, setUsername] = useState();
  const handleLogin = (user, token) => {
    setUsername(user.username);
    localStorage.setItem("token", token);
  }

  return (
    <Router>
      <nav style={{ margin: 10 }}>
        <Link to="/groups" style={{ padding: 5 }}>
          Groups
        </Link>
        <Link to="/profile" style={{ padding: 5 }}>
          Profile
        </Link>
        <Link to="/register" style={{ padding: 5 }}>
          Register
        </Link>
      </nav>
      <Routes>
        <Route path="/groups" element={<Groups />} />
        <Route path="/profile" element={<Profile username={username} />} />
        <Route path="/register" element={<Register login={handleLogin} />} />
      </Routes>
    </Router>
  );
}

const Groups = () => {
  const [data, setData] = useState();

  useEffect(() => {
    async function getGroups() {
      const res = await axios.get('/groups');
      setData(res.data.groups)
    }
    getGroups()
  }, []);
  return (

    <section>
      <div>Groups</div>
      <section>
        {data ? (
          data.map(item => (
            <div>
              <h1>{item.host}'s Group</h1>
              <h2>{item.groupId}</h2>
            </div>
          ))) : (<div></div>)}

      </section>
    </section>
  )
}

const Profile = ({ username }) => {
  const [data, setData] = useState();
  const token = localStorage.getItem("token");
  useEffect(() => {
    async function getUser(username) {
      console.log(token)
      console.log(username)
      const res = await axios.get(`/users/${username}`, { headers: { Authorization: `Bearer ${token}`}});
      setData(res.data)
    }
    getUser(username)
  }, []);
  return (
    <section>
      <div>Profile</div>
    </section>
  )
}

const Register = ({ login }) => {
  const INITIAL_STATE = { username: "", password: "", email: "" }
  const [formData, setFormData] = useState(INITIAL_STATE)
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({
      ...data,
      [name]: value
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { username, password, email } = formData;
      const user = { username, password, email };
      const res = await axios.post('/auth/register', formData);
      const token = res.data.token
      login(user, token);
      setFormData(INITIAL_STATE);
      // navigate("/groups");
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <section>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" name="username" onChange={handleChange} />
        <input type="text" placeholder="password" name="password" onChange={handleChange} />
        <input type="email" placeholder="email" name="email" onChange={handleChange} />
        <button type="submit" />
      </form>
    </section>
  )
}

export default App;
