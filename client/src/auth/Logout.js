import React, { useContext } from 'react';
import { AuthContext } from '../auth';
import { useNavigate } from 'react-router-dom';
const Logout = () => {
    const { logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        logout();
        navigate("/login");
    }

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <button type="submit">Logout</button>
            </form>
        </section>
    )
}

export default Logout