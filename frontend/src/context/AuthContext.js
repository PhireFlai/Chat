import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    const fetchUser = useCallback(async () => {
        try {
            // Decode the JWT token to get the user ID
            const decodedToken = jwtDecode(token);

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${decodedToken.userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchUser();
        }
    }, [token, fetchUser])



    const login = async (username, password) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                setToken(data.token);
                localStorage.setItem('token', data.token);
                setUser(data);
            } else {
                throw new Error('Invalid email or password');
            }
        } catch (error) {
            throw error;
        }

    };
    const register = async (username, password) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                setToken(data.token);
                localStorage.setItem('token', data.token);
                setUser(data);
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };


    const followUser = async (userid, otherId) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/users/${userid}/follow/${otherId}`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                }
            )

            if (!response.ok) {
                throw new Error("failed to follow user");
            }
            return await response.json();
        } catch (error) {
            throw error;
        }

    }

    const allUsers = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/users`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        'Content-Type': "application/json"
                    }
                }
            )
            return await response.json();

        } catch (error) {
            throw new Error("Failed to get All users")
        }
    }

    const followedUsers = async (userid) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/users/${userid}/followed`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        'Content-Type': "application/json"
                    }
                }
            )

            if (!response.ok) {
                throw new Error("failed to get follow user");
            }
            return await response.json();
        } catch (error) {
            throw error;
        }

    }

    // Create or get a chat
    const createOrGetChat = async (otherUserId) => {
        const members = [user.id, otherUserId];
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chats/create`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: "",
                type: "private",
                members
            })
        });
        if (!response.ok) throw new Error("Failed to create or get chat");
        const data = await response.json();
        return data.chat;
    };

    const getChat = async (chatId) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/chats/${chatId}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to get chat");
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    };



    const createGroupChat = async (name, userIds) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/chats/create`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        type: "group",
                        members: userIds
                    })
                }
            );
            if (!response.ok) {
                throw new Error("Failed to create group chat");
            }
            const data = await response.json();
            return data.chat;
        } catch (error) {
            throw error;
        }
    };

    const addUsersToChat = async (chatId, userIds) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/chats/${chatId}/add-users`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userIds }),
                }
            );
            if (!res.ok) throw new Error('Failed to add users');
        } catch (error) {
            throw error;
        }
    }

    const fetchMessages = async (chatId) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/chats/${chatId}/messages`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch messages");
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    };

    const sendMessage = async (chatId, content) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/chats/${chatId}/message`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ content })
                }
            );
            if (!response.ok) {
                throw new Error("Failed to send message");
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    };

    const fetchUserChats = async (userId) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/users/${userId}/chats`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            if (!response.ok) {
                throw new Error("Failed to Fetch Chats");
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    };

    const renameChat = async (chatId, newName) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/chats/${chatId}/rename`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ newName })
                }
            )
            if (!response.ok) {
                throw new Error("Failed to Rename Chat")
            }
        } catch (error) {
            throw error;
        }
    }

    const sendImage = async (chatId, image) => {
        if (image) {
            const formData = new FormData()
            formData.append('image', image);
            console.log(formData)
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/chats/${chatId}/upload`,
                    {
                        method: 'POST',
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                        body: formData
                    }
                )
                return await response.json();

            } catch (err) {
                console.error('Failed to upload image: ', err)
            }
        }
    }


    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            register,
            logout,
            followUser,
            allUsers,
            followedUsers,
            createOrGetChat,
            createGroupChat,
            getChat,
            addUsersToChat,
            fetchMessages,
            sendMessage,
            fetchUserChats,
            renameChat,
            sendImage,

        }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };
