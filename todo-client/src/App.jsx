import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TodoPage from './pages/TodoPage';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

 const handleSignOut = () => {
    localStorage.removeItem('token');
    setToken(null);
  };
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <LoginPage setToken={setToken} />}
        />
        <Route
          path="/"
          element={token ? <TodoPage onSignOut={handleSignOut} /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
