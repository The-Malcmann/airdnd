import axios from 'axios';
import React, { useState, useEffect, useContext} from 'react';
import { AuthContext } from '../auth';
const Profile = () => {
    const [data, setData] = useState();
    // const token = localStorage.getItem("token");
    const { token, username } = useContext(AuthContext);
  
    useEffect(() => {
      async function getUser(username, token) {
        if (!username || !token) return
  
        const res = await axios.get(`/users/${username}`, { headers: { Authorization: `Bearer ${token}` } });
        setData(res.data)
      }
      getUser(username, token)
    }, [username, token]);
    return (
      <section>
        <div>Profile</div>
        <div>
          {data ?
            <div>
              <h1>Username: {data.user.username}</h1>
              <h2>email: {data.user.email}</h2>
              <h2>prefRemote: {data.user.prefRemote ? "true" : "false"}</h2>
              <h2>prefInPerson: {data.user.prefInPerson ? "true" : "false"}</h2>
              <h2>Can DM? {data.user.canDm ? "true" : "false"}</h2>
            </div> :
            <div></div>}
  
        </div>
      </section>
    )
  }

export default Profile;