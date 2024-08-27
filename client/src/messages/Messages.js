import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useCreateChatClient, Chat, Channel, ChannelList, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import { AuthContext } from '../auth';
import './Messages.css'

/** */
const Messages = () => {
    // State
    const [channel, setChannel] = useState()
    const [filters, setFilters] = useState()
    const [users, setUsers] = useState()
    const { client, username, token } = useContext(AuthContext);
    // sorting criteria for channels
    const sort = { last_message_at: -1 };
    // options for channel query, limit to 10 channels
    const options = {
        limit: 10,
    };
    // Effect: fetch users and set up chat channel
    useEffect(() => {
        // catch cases where client, username or token are not set
        if (!client || !username || !token) return

        // fetch users and store in state
        const getUsers = async() => {
            const res = await axios.get(`/users/`, { headers: { Authorization: `Bearer ${token}` }} )
            setUsers(res.data.users)
        }
        getUsers()
        // catch cases where users are not set
        if(!users) return

        // create a channel for messaging, hardcoding the first two users
        const channel = client.channel('messaging', {
            image: 'https://getstream.io/random_png/?name=react',
            name: 'Talk about React',
            members: [users[0].username, users[1].username],
        });
        // set filters for channel list
        const filters = {
            type: 'messaging',
            members: { $in: [username] },
        };
        
        setChannel(channel)
        setFilters(filters)
    }, [users])

    // if client is not set, return a loading message
    if (!client) return <div>Setting up client & connection...</div>;

    return (
        <Chat client={client} theme='str-chat__theme-custom'>
            <ChannelList filters={filters} sort={sort} options={options} />
            <Channel channel={channel}>
                <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput />
                </Window>
                <Thread />
            </Channel>
        </Chat>
    )
}

export default Messages;