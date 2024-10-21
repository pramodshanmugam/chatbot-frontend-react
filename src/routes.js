import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Chat from './components/Chat';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" />} /> {/* Redirect root to /chat */}
        <Route path="/chat" element={<Chat />} />             {/* Chat page route */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;
