// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, saveToken, saveUser } from '../../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await login(email, password);
      saveToken(res.token);
      saveUser(res.user);
      navigate('/dashboard');
    } catch (error) {
      setErr(error?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="mobile-frame bg-white p-6 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-1">Sign in</h2>
        <p className="text-sm text-gray-500 mb-4">Network Log & AI Prediction Admin</p>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm">Email</label>
            <input className="w-full border p-2 rounded mt-1" value={email} onChange={e=>setEmail(e.target.value)} type="email" required/>
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input className="w-full border p-2 rounded mt-1" value={password} onChange={e=>setPassword(e.target.value)} type="password" required/>
          </div>
          {err && <div className="text-red-500 text-sm">{err}</div>}
          <button className="w-full bg-blue-600 text-white py-2 rounded">Sign in</button>
        </form>
        <div className="text-xs text-gray-500 mt-3">
          Demo: admin@example.com / admin123
        </div>
      </div>
    </div>
  );
}
