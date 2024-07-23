import axios from 'axios';
import React, { useState, useEffect, useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../auth';

const Group = () => {
    const params = useParams();
    const [group, setGroup] = useState();
    const [activeMembers, setActiveMembers] = useState();
    const [pendingMembers, setPendingMembers] = useState();
    const [changedGroup, setChangedGroup] = useState();
    const [isHost, setIsHost] = useState(false)
    const navigate = useNavigate();
    const { username, token } = useContext(AuthContext);
    useEffect(() => {
      async function getGroup() {
        if (!token || !username) return
        const res = await axios.get(`/groups/${params.id}`);
        setGroup(res.data.group)
        setIsHost(username == res.data.group.host);
      }
      async function getMembers() {
        if (!token || !username) return
        const res = await axios.get(`/members/groups/${params.id}`, { headers: { Authorization: `Bearer ${token}` } })
        setActiveMembers(res.data.activeMembers)
        setPendingMembers(res.data.pendingMembers)
      }
      getGroup()
      getMembers()
    }, [params, changedGroup])
  
  
    const joinGroup = async () => {
      setChangedGroup(false)
      const res = await axios.post(`/members/users/${username}/groups/${group.id}/request`, {}, { headers: { Authorization: `Bearer ${token}` } })
      setChangedGroup(true)
    }
  
    const approveRequest = async (username) => {
      setChangedGroup(false)
      const res = await axios.patch(`/members/users/${username}/groups/${group.id}/request`, {}, { headers: { Authorization: `Bearer ${token}` } })
      setChangedGroup(true)
    }

    const removeUser = async (username) => {
      setChangedGroup(false)
      const res = await axios.delete(`/members/users/${username}/groups/${group.id}/request`, { headers: { Authorization: `Bearer ${token}` } })
      setChangedGroup(true)
    }

    const deleteGroup = async () => {
      const res = await axios.delete(`/groups/${group.id}`, { headers: { Authorization: `Bearer ${token}` } })
      navigate("/groups")
    }
    const isInGroup = () => {
      if(!pendingMembers || !activeMembers) return;
      for (let i = 0; i < pendingMembers.length; i++) {
        if (pendingMembers[i].userId == username) return true;
      }
      for (let i = 0; i < activeMembers.length; i++) {
        if (activeMembers[i].userId == username) return true;
      }
      return false;
    }
    const hostGroup = () => {
      return (
        <div>
          <div>
            <h1>You are the host of this group</h1>
            <h1>{group.id}</h1>
            <div>
              <h4>Active Members:</h4>
              {activeMembers ?
                (activeMembers.map(item => (
                  <div>
                    <p>{item.userId}</p>
                    
                    {item.userId == group.host? <div></div> : <button onClick={() => removeUser(item.userId)}>Kick User</button>}
                  </div>
                )))
                : <div></div>}
              <h4>Pending Members:</h4>
              {pendingMembers ?
  
                (pendingMembers.map(item => (
                  <div>
                    <p>{item.userId}</p>
                    <button onClick={() => approveRequest(item.userId)}>Approve User</button>
                    <button onClick={() => removeUser(item.userId)}>Reject User</button>
                  </div>
                )))
                : <div></div>}
              <h1>Group size: {group.currentPlayers}</h1>
            </div>
            <button onClick={deleteGroup}>Delete Group</button>
          </div>
        </div>
      )
    }
  
    const defaultGroup = () => {
      console.log(pendingMembers)
      return (
        <div>
          <div>
            <h1>{group.id}</h1>
            {isInGroup() ? <div></div> : <button onClick={joinGroup}>Join Group</button>}
            <div>
              <h4>Active Members:</h4>
              {activeMembers ?
                (activeMembers.map(item => (
                  <div>
                    <p>{item.userId}</p>
                  </div>
                )))
                : <div></div>}
              <h4>Pending Members:</h4>
              {pendingMembers ?
  
                (pendingMembers.map(item => (
                  <div>
                    <p>{item.userId}</p>
                  </div>
                )))
                : <div></div>}
            </div>
          </div>
  
        </div>
      )
    }
    return (
      <div>
        <button onClick={() => navigate("/groups")}>Back</button>
        {group ?
          isHost ?
            hostGroup() :
            defaultGroup() :
          <div></div>
        }
      </div>
    )
  }

export default Group