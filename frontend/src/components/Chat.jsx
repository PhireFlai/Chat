
import React, { useContext, useEffect, useState, } from 'react'
import { useParams, useNavigate } from 'react-router'
import Message from './Message'
import { AuthContext } from '../context/AuthContext'
import { io } from 'socket.io-client'

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
    withCredentials: true
});

const Chat = () => {
    const { id: chatId } = useParams();

    const { user, fetchMessages, sendMessage, sendImage } = useContext(AuthContext);
    const [messages, setMessages] = useState([])

    const [input, setInput] = useState("")
    const [error, setError] = useState(null);


    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null);

    const navigate = useNavigate();

    // sends messages in websockets for live update information
    useEffect(() => {
        if (!chatId) return;

        socket.emit('joinChat', chatId);

        return () => {
            socket.emit('leaveChat', chatId);
        };
    }, [chatId]);

    // send messages and update messages after new message 
    useEffect(() => {
        const handler = (message) => {
            setMessages(prev => [...prev, message]);
        };

        socket.on('receiveMessage', handler);

        return () => {
            socket.off('receiveMessage', handler);
        };
    }, []);

    // fetch messages from backend
    useEffect(() => {
        const loadMessages = async () => {
            if (chatId) {
                try {
                    const msgs = await fetchMessages(chatId)
                    console.log("Fetched messages:", msgs);
                    setMessages(msgs)

                } catch (err) {
                    setError('Cannot Load Chat');
                    socket.emit('leaveChat', chatId);

                }
            }
        }
        loadMessages()
    }, [chatId])



    // handle sending messages
    const handleMessage = async (content) => {
        if (!input.trim()) return;

        try {
            const newMessage = await sendMessage(chatId, content);

            if (!newMessage.sender) {
                newMessage.sender = { id: user.id, username: user.username };
            }

            socket.emit('sendMessage', {
                chatId,
                message: newMessage
            });

        } catch (error) {
            alert("failed to send message")
        }
    }

    // handles uploading images
    const handleImage = async (image) => {
        try {
            const newMessage = await sendImage(chatId, image);
            console.log(newMessage);

            if (!newMessage.sender) {
                newMessage.sender = { id: user.id, username: user.username };
            }

            socket.emit('sendMessage', {
                chatId,
                message: newMessage
            });

        } catch (error) {
            alert("failed to send message")
        }
    }

    // handle submiting messages and images
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (image) {
            await handleImage(image)
            setImage(null)
            setPreview(null)
        }
        if (input.trim()) {
            await handleMessage(input);
            setInput('');
        }
    };

    // handle upload of files for images
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        } else {
            alert("Not a valid image format!");
        }
        e.target.value = "";
    };

    // display an error screen if there is an error
    if (error) {
        return (
            <div className="access-denied-container">
                <div className="access-denied-content">
                    <h2>Access Denied</h2>
                    <p>{error}</p>

                    <div className="action-buttons">
                        <button
                            onClick={() => navigate('/')}
                            className="back-button"
                        >
                            Return to Home
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="retry-button"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // display the chat
    return (
        // maps each message to a message component
        <div class="h-128 overflow-y-auto" >
            {messages.map(msg => (
                <Message
                    key={msg.id}
                    type={msg.type}
                    content={msg.content}
                    sender={msg.sender.username}
                    createdAt={msg.createdAt}
                    updatedAt={msg.updatedAt}
                    imageUrl={msg.url}
                />
            )

            )}


            {/*  renders a preview item when an image is uploaded */}
            {preview && (
                <img
                    src={preview}
                    alt="preview"
                    style={{
                        width: "120px",
                        objectFit: 'cover',
                        boxShadow: '4px'
                    }}
                />
            )}

            {/* handles submissions of images and messags */}
            <form onSubmit={handleSubmit} style={{ marginTop: 4 }}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your message..."
                    style={{ width: '80%' }}
                />
                <button type="submit" style={{ marginLeft: 2 }}>Send</button>

                <div>
                    {/* image upload button TODO change CSS*/}
                    <label style={{
                        marginLeft: 8,
                        background: "#eee",
                        padding: "4px 8px",
                        borderRadius: 4,
                        cursor: "pointer"
                    }}>
                        📷
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                    </label>

                </div>
            </form>

        </div >
    )
}

export default Chat;
