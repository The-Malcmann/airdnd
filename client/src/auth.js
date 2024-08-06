import { createContext, useEffect, useState } from "react";
import { StreamChat } from 'stream-chat';
// require('dotenv').config()
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [chatToken, setChatToken] = useState("");
    const [username, setUsername] = useState("");
    const [client, setClient] = useState()

    useEffect(() => {
        async function init() {
            if (!chatToken) return
                const chatClient = StreamChat.getInstance(process.env.REACT_APP_API_KEY, {
                    timeout: 6000,
                });
                chatClient.connectUser(
                    {
                        id: username,
                        name: username,
                        image: `https://getstream.io/random_svg/?name=${username}`,
                    },
                    chatToken
                )
                setClient(chatClient);
        }
        init()
    }, [chatToken])

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setToken(token)
        const username = localStorage.getItem("username");
        if (username) setUsername(username)
        const chatToken = localStorage.getItem("chatToken")
        if (chatToken) setChatToken(chatToken)
    }, [])
    useEffect(() => {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("chatToken", chatToken)
    }, [token, username, chatToken])

    async function login(username, token, chatToken) {
        setUsername(username);
        setToken(token);
        setChatToken(chatToken);
        // await client.connectUser(
        //     {
        //         id: username,
        //         name: username,
        //         image: `https://getstream.io/random_svg/?name=${username}`,
        //     },
        //     chatToken
        // )
    }

    function logout() {
        setUsername("");
        setToken("");
        setChatToken("");
        // client.disconnectUser()
    }


    return (
        <AuthContext.Provider value={{ token, username, login, logout, client }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext }