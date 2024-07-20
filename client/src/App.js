import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, Outlet } from 'react-router-dom';

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
        <Link to="/login" style={{ padding: 5 }}>
          Login
        </Link>
      </nav>
      <Routes>
        <Route path="groups" element={<Groups username={username}/>} />
        <Route path="/groups/add" element={<AddGroup username={username}/>}/>
        <Route path="/profile" element={<Profile username={username} />} />
        <Route path="/register" element={<Register login={handleLogin} />} />
        <Route path="/login" element={<Login login={handleLogin} />} />
      </Routes>
    </Router>
  );
}

const Groups = ({username}) => {
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
              <h1>{item.title}</h1>
              <h1>Host: {item.host}</h1>
              <h2>{item.groupId}</h2>
            </div>
          ))) : (<div></div>)}

      </section>
      <div>
        <Link to="add">New Group</Link>
      </div>
      <Outlet />
    </section>
  )
}

const AddGroup = ({username}) => {
  const INITIALSTATE = {title: "", description: "", host: username,gameEdition: "", isRemote: false}
  const [formData, setFormData] = useState(INITIALSTATE);
  const token = localStorage.getItem("token");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({
      ...data,
      [name]: value
    }));
  }
  const handleCheckbox = (e) => {
    const {checked} = e.target;
    setFormData(data => ({
      ...data,
      isRemote: checked
    }));
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData)
      const res = await axios.post(`/groups`, formData, { headers: { Authorization: `Bearer ${token}` } });
      console.log(res);
    } catch(err) {
      console.log(err)
    }
  }
  return (
    <section>
      <div>New Group</div>
      <form onSubmit={handleSubmit}>
        <input name="title" type="text" placeholder="Title" onChange={handleChange}/>
        <input name="description" type="text" placeholder="Description" onChange={handleChange}/>
        <input name="gameEdition" type="text" placeholder="Edition" onChange={handleChange}/>
        <input name="remote" type="checkbox" onChange={handleCheckbox}/>
        <label htmlFor="remote">Remote?</label>
        <button name="submit" type="submit" >Submit</button>
      </form>
    </section>
  )
}
const Profile = ({ username }) => {
  const [data, setData] = useState();
  const token = localStorage.getItem("token");
  useEffect(() => {
    async function getUser(username) {
      const res = await axios.get(`/users/${username}`, { headers: { Authorization: `Bearer ${token}` } });
      setData(res.data)
    }
    getUser(username)
  }, []);
  return (
    <section>
      <div>Profile</div>
      <div>
        {data ? 
        <div>
          <h1>Username: {data.user.username}</h1> 
          <h2>email: {data.user.email}</h2> 
          <h2>prefRemote: {data.user.prefRemote? "true" : "false"}</h2>
          <h2>prefInPerson: {data.user.prefInPerson? "true" : "false"}</h2>
          <h2>Can DM? {data.user.canDm? "true" : "false"}</h2>
        </div> : 
        <div></div>}
        
      </div>
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
      navigate("/groups");
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
const Login = ({ login }) => {
  const INITIAL_STATE = { username: "", password: "" }
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
      const { username, password } = formData;
      const user = { username: formData.username };
      const res = await axios.post('/auth/token', formData);
      const token = res.data.token
      login(user, token);
      setFormData(INITIAL_STATE);
      navigate("/groups");
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <section>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" name="username" onChange={handleChange} />
        <input type="text" placeholder="password" name="password" onChange={handleChange} />
        {/* <input type="email" placeholder="email" name="email" onChange={handleChange} /> */}
        <button type="submit" />
      </form>
    </section>
  )
}

export default App;
