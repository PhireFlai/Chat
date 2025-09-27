import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { AuthContext } from '../context/AuthContext'

const ChatEdit = () => {

    const { user, renameChat, addUsersToChat, allUsers, getChat } = useContext(AuthContext);
    const { id: chatId } = useParams();
    const navigate = useNavigate();

    const [newName, setNewName] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [showAddUsers, setShowAddUsers] = useState(false);
    const [allUserList, setAllUserList] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [addUserSuccess, setAddUserSuccess] = useState(false);
    const [chatType, setChatType] = useState(null);


    // gets list of users in the chat
    useEffect(() => {
        if (showAddUsers) {
            allUsers().then(users => setAllUserList(users.filter(u => u.id !== user?.id)));
        }
    }, [showAddUsers, allUsers, user]);

    // gets the chat information
    useEffect(() => {
        const fetchChat = async () => {
            try {
                const res = await getChat(chatId);
                if (res.ok) {
                    const chat = await res.json();
                    setChatType(chat.type);
                    setNewName(chat.name || '');
                }
            } catch (err) {
                setError('Failed to fetch chat info');
            }
        };
        fetchChat();
    }, [chatId]);

    // handles when the user renames the chat
    const handleRename = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        try {
            await renameChat(chatId, newName);
            setSuccess(true);
            setTimeout(() => navigate(`/chat/${chatId}`), 1000);
        } catch (err) {
            setError('Failed to rename chat');
        }
    };

    // handles when a user is added to the chat
    const handleAddUsers = async () => {
        setError(null);
        setAddUserSuccess(false);
        try {
            await addUsersToChat(chatId, selectedUsers)
            setAddUserSuccess(true);
            setShowAddUsers(false);
            setSelectedUsers([]);
        } catch (error) {
            console.log(error);
            setError('Failed to add users')
        }
    }
    
    //TODO add filter for users already in chat
    const toggleSelectUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };


    return (
        <div>
            {/* renames the chat */}
            <h2>Rename Chat</h2>
            <form onSubmit={handleRename}>
                <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Enter new chat name"
                />
                <button type="submit">Rename</button>
            </form>

            <hr />

        {/* handles if the chat is not a DM, allowing add users */}
            {chatType !== 'private' && (
                <button onClick={() => setShowAddUsers(v => !v)}>
                    {showAddUsers ? "Cancel" : "Add Users to Chat"}
                </button>
            )}

            {addUserSuccess && <div style={{ color: 'green' }}>Users added!</div>}

            {/* displays a list of all userse to add */}
            {showAddUsers && (
                <div>
                    <h3>Select users to add:</h3>
                    {allUserList.length === 0 && <div>No users available</div>}
                    {allUserList.map(u => (
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
                    
                    {/* confirms adding users */}
                    <button
                        onClick={handleAddUsers}
                        disabled={selectedUsers.length === 0}
                        style={{ marginTop: 8 }}
                    >
                        Add Selected Users
                    </button>
                </div>
            )}

            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>Chat renamed!</div>}
        </div>
    );
}

export default ChatEdit
