import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import "../App.css"
import { AuthContext } from '../auth';
const Profile = () => {
  const [data, setData] = useState();
  const [activeGroups, setActiveGroups] = useState();
  const [pendingGroups, setPendingGroups] = useState();
  // const token = localStorage.getItem("token");
  const { token, username, client } = useContext(AuthContext);

  useEffect(() => {
    async function getUser() {
      if (!username || !token) return
      const res = await axios.get(`/users/${username}`, { headers: { Authorization: `Bearer ${token}` } });
      setData(res.data)
    }
    async function getGroups() {
      if (!username || !token) return
      const resActive = await axios.get(`/members/users/${username}/active`, { headers: { Authorization: `Bearer ${token}` } })
      const resPending = await axios.get(`/members/users/${username}/pending`, { headers: { Authorization: `Bearer ${token}` } })
      console.log(resActive.data.groups)
      setActiveGroups(resActive.data.groups)
      setPendingGroups(resPending.data.groups)
      console.log(client)
    }
    getUser()
    getGroups()
  }, [username, token]);
  return (
      <section>
        <div className="container">
          <h1>Profile</h1>
          <div>
            {data ?
              <div className="container">
                <h2>Username: {data.user.username}</h2>
                <h3>email: {data.user.email}</h3>
                <h3>prefRemote: {data.user.prefRemote ? "true" : "false"}</h3>
                <h3>prefInPerson: {data.user.prefInPerson ? "true" : "false"}</h3>
                <h3>Can DM? {data.user.canDm ? "true" : "false"}</h3>
                <h1>Your Groups</h1>
                <h2>Active:</h2>
                {activeGroups ?
                  activeGroups.map(item => (
                    <h3>{item.title}</h3>
                  )) : <div></div>}
                <h2>Pending:</h2>
                {pendingGroups ?
                  pendingGroups.map(item => (
                    <h3>{item.title}</h3>
                  )) : <div></div>}
              </div> :
              <div></div>}

          </div>
        </div>

      </section>
  )
}

export default Profile;