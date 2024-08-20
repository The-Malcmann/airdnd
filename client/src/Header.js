// components/Header.js
import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './auth';
import "./Header.css"


function Header({ isLargeScreen }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMaxScreen, setIsMaxScreen] = useState(window.innerWidth > 2520)
    const [menuStyle, setMenuStyle] = useState({});
    const menuButtonRef = useRef(null);

    const { username, token } = useContext(AuthContext)
    const navigate = useNavigate()

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const updateMenuPosition = () => {
        if (menuButtonRef.current) {
            const rect = menuButtonRef.current.getBoundingClientRect();
            setMenuStyle({
                position: 'absolute',
                top: `${rect.bottom}px`,
                left: `${rect.right - 200}px`,
            });
        }
    };

    useEffect(() => {
        if (isMenuOpen) {
            updateMenuPosition();
        }
    }, [isMenuOpen]);

    useEffect(() => {
        if (isMenuOpen) {
            window.addEventListener('resize', updateMenuPosition);
        }
        return () => {
            window.removeEventListener('resize', updateMenuPosition);
        };
    }, [isMenuOpen]);
    return (
        <>
            {isLargeScreen && (
                <>
                    <header>
                        <div className="header-layout">
                            <button className="home-button" onClick={() => navigate("/")}>Home</button>
                            <button ref={menuButtonRef} className="menu-button" onClick={toggleMenu}>☰</button>
                        </div>
                    </header>
                    {isMenuOpen ?
                        <nav>
                            <div className="header-dropdown" style={menuStyle}>

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
                                    <Link to="/messages" style={{ padding: 5 }}>
                                        Messages
                                    </Link> :
                                    <></>
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