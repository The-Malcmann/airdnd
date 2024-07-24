import React, { useContext } from 'react';
import { AuthContext } from './auth';
import { Link } from "react-router-dom";
import "./Nav.css"
const Nav = ({ isLargeScreen, isVisible }) => {
    const { username, token } = useContext(AuthContext)
    return (
        <>
            {!isLargeScreen && (
                <nav className={`bottom-navbar ${isVisible ? 'visible' : 'hidden'}`}>
                    <div class="links">
                        <Link to="/" style={{ padding: 5 }} class="link">
                            Groups
                        </Link>
                        {username ?
                            <Link to="/profile" style={{ padding: 5 }} class="link">
                                Profile
                            </Link> :
                            <Link to="/register" style={{ padding: 5 }}>
                                Register
                            </Link>
                        }
                        {username ?
                            <Link to="/logout" style={{ padding: 5 }} class="link">
                                Logout
                            </Link> :
                            <Link to="/login" style={{ padding: 5 }}>
                                Login
                            </Link>
                        }
                    </div>
                </nav>
            )}
        </>
    )
}

export default Nav;