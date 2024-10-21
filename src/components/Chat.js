import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { v4 as uuidv4 } from 'uuid'; // Import the UUID generator

function Chat() {
  const [userMessage, setUserMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [sessionId, setSessionId] = useState(() => uuidv4()); // Generate unique session ID
  const messageEndRef = useRef(null);

  // Fetch chat history when component loads
  useEffect(() => {
    fetch(`http://localhost:8000/api/chat_history/?session_id=${sessionId}`)
      .then(response => response.json())
      .then(data => setConversation(data));
  }, [sessionId]);

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  const sendMessage = () => {
    if (userMessage.trim() === '') return;

    const newMessage = { role: 'user', content: userMessage };
    setConversation([...conversation, newMessage]);
    setUserMessage('');

    // Send message to the backend
    fetch('http://localhost:8000/api/chat/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, session_id: sessionId }),
    })
      .then(response => response.json())
      .then(data => {
        const botMessage = { role: 'bot', content: data.response };
        setConversation(prev => [...prev, botMessage]);
      });
  };

  return (
    <div className="chat-window">
      <div className="conversation">
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <div className="input-area">
        <input 
          type="text" 
          value={userMessage} 
          onChange={(e) => setUserMessage(e.target.value)} 
          placeholder="Type a message..." 
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
