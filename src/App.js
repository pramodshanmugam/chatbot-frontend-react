import React, { useState, useEffect } from 'react';
import './App.css';
import Chat from './Chat';

// Helper function to generate a random session ID
const generateSessionId = () => {
  return `session-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(generateSessionId());

  useEffect(() => {
    // Create the initial session and add it to the list
    const initialSession = generateSessionId();
    setSessions([initialSession]);
    setActiveSession(initialSession);
  }, []);

  const handleNewSession = () => {
    const newSession = generateSessionId();
    setSessions([...sessions, newSession]);
    setActiveSession(newSession);  // Set the new session as active
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Sessions</h2>
        <ul>
          {sessions.map((session, index) => (
            <li 
              key={index} 
              className={activeSession === session ? 'active' : ''} 
              onClick={() => setActiveSession(session)}
            >
              {session}
            </li>
          ))}
        </ul>
        <button onClick={handleNewSession}>New Session</button> {/* Button to generate a new session */}
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        <Chat session={activeSession} />
      </div>
    </div>
  );
}

export default App;
