import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TodoPage from './pages/TodoPage';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token')||null);


 useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);
  return (
    <Router>
          <Routes>
            <Route
              path="/login"
              element={token ? <Navigate to="/" /> : <LoginPage setToken={setToken} />}
            />
            <Route
              path="/"
              element={token ? <TodoPage /> : <Navigate to="/login" />}
            />
          </Routes>
        </Router>
  );
};

export default App;
