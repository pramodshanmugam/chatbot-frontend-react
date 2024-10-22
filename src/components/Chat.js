import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';  // Import the Chat.css file for styling

const Chat = () => {
    const [userMessage, setUserMessage] = useState("");
    const [conversation, setConversation] = useState([]);
    const socketRef = useRef(null);
    const sessionId = '12345';  // Replace this with your actual session ID logic

    useEffect(() => {
        // Open WebSocket connection
        socketRef.current = new WebSocket('ws://localhost:8000/ws/chat/');

        // Event handler when the connection is opened
        socketRef.current.onopen = () => {
            console.log("WebSocket connection established.");
        };

        // Event handler when the server sends a message
        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received message from server:", data);

            // Update the conversation with the bot's response
            setConversation((prevConversation) => [
                ...prevConversation,
                { role: 'bot', content: data.message },  // Make sure the key matches the backend response
            ]);
        };

        // Event handler when the connection is closed
        socketRef.current.onclose = (event) => {
            console.log("WebSocket connection closed:", event);
        };

        // Event handler when there's an error with the WebSocket connection
        socketRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            // Cleanup WebSocket when component unmounts
            socketRef.current.close();
        };
    }, []);

    const sendMessage = () => {
        if (userMessage.trim() === "") return;

        // Send user message to WebSocket server
        socketRef.current.send(JSON.stringify({
            message: userMessage,
            session_id: sessionId
        }));

        // Update conversation with the user message
        setConversation((prevConversation) => [
            ...prevConversation,
            { role: 'user', content: userMessage }
        ]);

        // Clear input field
        setUserMessage("");
    };

    return (
        <div className="chat-container">
            <div className="chat-window">
                <div className="conversation">
                    {conversation.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}
                        >
                            {msg.content}
                        </div>
                    ))}
                </div>
                <div className="input-area">
                    <input
                        type="text"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        placeholder="Type a message"
                    />
                    <button onClick={sendMessage} disabled={!userMessage.trim()}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
