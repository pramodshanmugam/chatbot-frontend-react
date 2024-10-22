import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';  // Import the external CSS file

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

            // Handle the message based on \n
            updateBotMessage(data.message);
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

    const updateBotMessage = (message) => {
        // Split the message based on newlines
        const messageChunks = message.split("\n");

        // Only append complete chunks to the conversation
        setConversation((prevConversation) => {
            const lastMessage = prevConversation[prevConversation.length - 1];

            if (lastMessage && lastMessage.role === 'bot') {
                // Append to the last bot message if it's incomplete
                const updatedMessage = lastMessage.content + messageChunks[0];
                const updatedConversation = [...prevConversation];
                updatedConversation[updatedConversation.length - 1] = { role: 'bot', content: updatedMessage };

                return updatedConversation.concat(
                    messageChunks.slice(1).map((chunk) => ({ role: 'bot', content: chunk }))
                );
            }

            // Add new bot messages when \n is encountered
            return prevConversation.concat(
                messageChunks.map((chunk) => ({ role: 'bot', content: chunk }))
            );
        });
    };

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
                            className={msg.role === 'user' ? 'message user' : 'message bot'}
                        >
                            {/* Display message normally */}
                            <p>{msg.content}</p>
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
