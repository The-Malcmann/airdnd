// components/Header.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './auth';
import "./Header.css"


function Header({ isLargeScreen }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { username, token } = useContext(AuthContext)
    const navigate = useNavigate()

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            {isLargeScreen && (
                <>
                <header>
                    <div className="header-layout">
                        <button className="home-button" onClick={() => navigate("/")}>Home</button>
                        <button className="menu-button" onClick={toggleMenu}>☰</button>
                        
                    </div>
                </header>
                {isMenuOpen ?
                    <nav>
                        <div className="header-dropdown">

                            <Link to="/" style={{ padding: 5 }} onClick={toggleMenu}>
                                Groups
                            </Link>
                            {username ?
                                <Link to="/profile" style={{ padding: 5 }} onClick={toggleMenu}>
                                    Profile
                                </Link> :
                                <Link to="/register" style={{ padding: 5 }} onClick={toggleMenu}>
                                    Register
                                </Link>
                            }
                            {username ?
                                <Link to="/logout" style={{ padding: 5 }} onClick={toggleMenu}>
                                    Logout
                                </Link> :
                                <Link to="/login" style={{ padding: 5 }} onClick={toggleMenu}>
                                    Login
                                </Link>
                            }
                        </div>
                    </nav>
                    : <></>}
                    </>
            )}
        </>

    );
}

export default Header;