import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../auth';

const Group = () => {
  const { username, token } = useContext(AuthContext);
  const INITIALSTATE = { title: "", description: "", maxPlayers: "", gameEdition: "", isRemote: false }
  const params = useParams();
  const [group, setGroup] = useState();
  const [formData, setFormData] = useState(INITIALSTATE);
  const [activeMembers, setActiveMembers] = useState();
  const [pendingMembers, setPendingMembers] = useState();
  const [changedGroup, setChangedGroup] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [isHost, setIsHost] = useState(false)
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name == "maxPlayers") {
      value = Number(value)
    }
    setFormData(data => ({
      ...data,
      [name]: value
    }));
  }
  const handleCheckbox = (e) => {
    const { checked } = e.target;
    setFormData(data => ({
      ...data,
      isRemote: checked
    }));
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setChangedGroup(false)
      console.log(formData)
      const res = await axios.patch(`/groups/${group.id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setIsEdit(false)
      setChangedGroup(true)
    } catch (err) {
      console.log(err)
    }
  }

  const toggleEdit = (edit) => {
    setIsEdit(edit);
    if (edit == true) {
      setFormData({ title: group.title, description: group.description, maxPlayers: group.maxPlayers, gameEdition: group.gameEdition, isRemote: group.isRemote })
    }

  }

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
    if (!pendingMembers || !activeMembers) return;
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
        <h1>You are the host of this group</h1>
        <div>
          {isEdit ?
            <div>
              <button onClick={() => toggleEdit(false)}>done</button>
              <form onSubmit={handleSubmit}>
                <input name="title" type="text" placeholder={group.title} onChange={handleChange} />
                <input name="description" type="text" placeholder={group.description} onChange={handleChange} />
                <input name="maxPlayers" type="number" placeholder={group.maxPlayers} onChange={handleChange} />
                <input name="gameEdition" type="text" placeholder={group.gameEdition} onChange={handleChange} />
                {group.isRemote? <input name="remote" id="remote" type="checkbox" defaultChecked={true} onChange={handleCheckbox}/> : <input name="remote" id="remote" type="checkbox" onChange={handleCheckbox} />}
                
                <label htmlFor="remote">Remote?</label>
                <button name="submit" type="submit" >Submit</button>
              </form>
            </div> :
            <div>
              <button onClick={() => toggleEdit(true)}>edit</button>
              <h2>{group.title}</h2>
              <h3>{group.description}</h3>
              <h3>Max Players: {group.maxPlayers}</h3>
              <h3>Edition: {group.gameEdition}</h3>
              {group.isRemote ?
                <div>
                  <h3>Remote? Yes</h3>
                </div> :
                <div>
                  <h3>Remote? No</h3>
                  <h3>Location: {group.location}</h3>
                </div>
              }
            </div>
          }


          <div>
            <h4>Active Members:</h4>
            {activeMembers ?
              (activeMembers.map(item => (
                <div>
                  <p>{item.userId}</p>

                  {item.userId == group.host ? <div></div> : <button onClick={() => removeUser(item.userId)}>Kick User</button>}
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
      <button onClick={() => navigate("/")}>Back</button>
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