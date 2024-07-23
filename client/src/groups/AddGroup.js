import React, { useState, useContext, act } from 'react';
import axios from 'axios';
import { AuthContext } from '../auth';

const AddGroup = () => {
    const { username } = useContext(AuthContext)
    const INITIALSTATE = { title: "", description: "", host: username, gameEdition: "", isRemote: false }
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
      const { checked } = e.target;
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
      } catch (err) {
        console.log(err)
      }
    }
    return (
      <section>
        <div>New Group</div>
        <form onSubmit={handleSubmit}>
          <input name="title" type="text" placeholder="Title" onChange={handleChange} />
          <input name="description" type="text" placeholder="Description" onChange={handleChange} />
          <input name="gameEdition" type="text" placeholder="Edition" onChange={handleChange} />
          <input name="remote" type="checkbox" onChange={handleCheckbox} />
          <label htmlFor="remote">Remote?</label>
          <button name="submit" type="submit" >Submit</button>
        </form>
      </section>
    )
  }

  export default AddGroup