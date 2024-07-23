import axios from 'axios';
import React, { useState, useContext} from 'react';
import { AuthContext } from '../auth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const { login } = useContext(AuthContext)
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
            login(username, token);
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

export default Register;