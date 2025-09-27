import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router';

const ChatList = () => {
    const { user, fetchUserChats, allUsers, createGroupChat } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showCreate, setShowCreate] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [userList, setUserList] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    // handles loading and getting all chats
    useEffect(() => {
        const getChats = async () => {
            if (user) {
                try {
                    setIsLoading(true);

                    const res = await fetchUserChats(user.id);

                    console.log(res);

                    setChats(res);

                } catch (error) {
                    console.error('Error fetching chats:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        }

        getChats();

    }, [user?.id, fetchUserChats])

    // handles creation of chats
    useEffect(() => {
        if (showCreate) {
            allUsers().then(users => setUserList(users.filter(u => u.id !== user.id)))
        }
    }, [showCreate, allUsers, user])

    const handleOpenChat = (chatId) => {
        navigate(`/chat/${chatId}`);
    };

    const navigateEditChat = (chatId) => {
        navigate(`/chat/${chatId}/edit`);
    };

    // allows selection of users to add
    const toggleSelectUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    // sends information to create chat in backend
    const handleCreateGroupChat = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const chat = await createGroupChat(groupName, [user.id, ...selectedUsers]);
            setShowCreate(false);
            setGroupName('');
            setSelectedUsers([]);
            setChats(prev => [...prev, chat]);
            navigate(`/chat/${chat.id}`);
        } catch (err) {
            setError('Failed to create group chat');
        }
    };

    return (
        <div>
            <h2>Your Chats</h2>
            <button onClick={() => setShowCreate(v => !v)}>
                {showCreate ? "Cancel" : "Create Group Chat"}
            </button>

            {/* element for creating chat */}
            {showCreate && (
                <form onSubmit={handleCreateGroupChat} style={{ margin: "1em 0" }}>
                    <input
                        type="text"
                        placeholder="Group chat name"
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                        required
                    />
                    <div>
                        {/* list of users to add */}
                        <strong>Select users:</strong>
                        {userList.length === 0 && <div>No users available</div>}
                        {userList.map(u => (
                            <div key={u.id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(u.id)}
                                        onChange={() => toggleSelectUser(u.id)}
                                    />
                                    {u.username}
                                </label>
                            </div>
                        ))}
                    </div>
                    <button type="submit" disabled={!groupName || selectedUsers.length === 0}>
                        Create
                    </button>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                </form>
            )}
            {isLoading && <div>Loading...</div>}
            
            {!isLoading && chats.length === 0 && <div>No chats found.</div>}
            
            {/* handles loading all chats avalible, TODO change to handle multiple chats */}
            {!isLoading && chats.map(chat => (
                <div key={chat.id}>
                    <span>
                        {chat.name || `Chat #${chat.id}`}{" "}
                        <span style={{ color: "#888", fontWeight: "normal" }}>
                            ({chat.type})
                        </span>
                    </span>
                    <button onClick={() => handleOpenChat(chat.id)}>Open Chat</button>
                    <button onClick={() => navigateEditChat(chat.id)}>Edit Chat</button>
                </div>
            ))}
        </div>
    );
};

export default ChatList;