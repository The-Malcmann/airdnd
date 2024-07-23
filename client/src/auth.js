import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setToken(token)
        const username = localStorage.getItem("username");
        if (username) setUsername(username)
    }, [])
    useEffect(() => {
        localStorage.setItem("token", token)
        localStorage.setItem("username", username)
    }, [token, username])

    function login (username, token) {
        setUsername(username)
        setToken(token);
    }

    function logout() {
        setUsername("")
        setToken("");
    }

    return(
        <AuthContext.Provider value={{token, username, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthProvider, AuthContext}