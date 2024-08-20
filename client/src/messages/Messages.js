import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useCreateChatClient, Chat, Channel, ChannelList, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import { AuthContext } from '../auth';
import './Messages.css'

const Messages = () => {

    const [channel, setChannel] = useState()
    const [filters, setFilters] = useState()
    const [users, setUsers] = useState()
    const { client, username, token } = useContext(AuthContext);
    
    const sort = { last_message_at: -1 };

    const options = {
        limit: 10,
    };

    useEffect(() => {
        if (!client || !username || !token) return
        const getUsers = async() => {
            const res = await axios.get(`/users/`, { headers: { Authorization: `Bearer ${token}` }} )
            setUsers(res.data.users)
        }
        getUsers()
        if(!users) return
        const channel = client.channel('messaging', {
            image: 'https://getstream.io/random_png/?name=react',
            name: 'Talk about React',
            members: [users[0].username, users[1].username],
        });
        const filters = {
            type: 'messaging',
            members: { $in: [username] },
        };
        
        setChannel(channel)
        setFilters(filters)
    }, [users])

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