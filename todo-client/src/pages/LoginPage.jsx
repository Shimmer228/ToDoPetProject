import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from "../config";

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();



  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const url = isLogin ? `${API_URL}/api/auth/login` : `${API_URL}/api/auth/register`;

    if (form.password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    try {
      const res = await axios.post(url, form);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response.data.message || 'Error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-xs">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {isLogin ? 'Sign in' : 'Sign up'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition"
          >
            {isLogin ? 'Sign in' : 'Sign up'}
          </button>
        </form>
        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-blue-700 hover:underline text-center mt-4 cursor-pointer"
        >
          {isLogin
            ? 'have no account? Sign up'
            : 'Have account? Sign in'}
        </p>
      </div>
    </div>
  );

};

export default LoginPage;