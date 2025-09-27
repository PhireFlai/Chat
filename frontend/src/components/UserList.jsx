import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router';

const UserList = ({ users: usersProp }) => {
    const { user, followUser, followedUsers, allUsers, createOrGetChat } = useContext(AuthContext);
    const [users, setUsers] = useState(usersProp || []);
    const [followedList, setFollowedList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // fetch list of users to display
    useEffect(() => {
        if (!usersProp) {
            const fetchUsers = async () => {
                try {
                    const data = await allUsers();
                    setUsers(data.filter(u => u.id !== user?.id));
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            };
            fetchUsers();
        }
    }, [usersProp, allUsers, user]);

    // fetch followed users TODO use this for better display information
    useEffect(() => {
        const fetchFollowed = async () => {
            if (user) {
                try {
                    setIsLoading(true);

                    const followed = await followedUsers(user.id);

                    const followedIds = followed.map(u => u.id);

                    setFollowedList(followedIds);

                } catch (error) {
                    console.error('Error fetching followed users:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchFollowed();
    }, [user?.id, followedUsers]);

    // handle getting or creating a chat
    const handleChat = async (otherId) => {
        try {
            const chat = await createOrGetChat(otherId);
            // alert(`Open chat with id: ${chat.id}`);
            navigate(`/chat/${chat.id}`); 
        } catch (error) {
            alert('Failed to open chat');
        }
    };

    // handles following a user
    const handleFollow = async (otherId) => {
        try {
            await followUser(user.id, otherId);
            // update UI
            setFollowedList(prev => [...prev, otherId]);
        } catch (error) {
            alert('Failed to follow');
        }
    };

    const isFollowed = (otherId) => followedList.includes(otherId);

    return (
        <div>
            {/* display list of users */}
            {users && users.map(u => (
                <div key={u.id}>
                    {u.username}
                    {user && (
                        <div>
                            {/* only display follow button if not following */}
                            {!isFollowed(u.id) && !isLoading && (
                                <button onClick={() => handleFollow(u.id)}>Follow</button>
                            )}
                            <button onClick={() => handleChat(u.id)}>Chat</button>
                        </div>
                    )}
                </div>
            ))}
            {!users && <div>No Users</div>}
        </div>
    );
};

export default UserList;