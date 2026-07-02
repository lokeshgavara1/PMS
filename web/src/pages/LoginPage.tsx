import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin, useCurrentUser } from '../api';
import { useAppStore } from '../stores/app';

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isLoading, error } = useLogin();
  const { data: user } = useCurrentUser();
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  const [email, setEmail] = useState('admin@cutm.ac.in');
  const [password, setPassword] = useState('password123');
  const [localError, setLocalError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      navigate('/dashboard');
    }
  }, [user, navigate, setCurrentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    login(
      { email, password },
      {
        onSuccess: (data) => {
          setCurrentUser(data.user);
          navigate('/dashboard');
        },
        onError: (err: any) => {
          setLocalError(err.response?.data?.error?.message || 'Login failed');
        },
      },
    );
  };

  // Demo users
  const demoUsers = [
    { email: 'admin@cutm.ac.in', role: 'Admin' },
    { email: 'hod.cse@cutm.ac.in', role: 'HOD' },
    { email: 'faculty1@cutm.ac.in', role: 'Faculty' },
    { email: 'pm@cutm.ac.in', role: 'Project Manager' },
    { email: 'student1@cutm.ac.in', role: 'Student' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">CUTM-PMS</h1>
            <p className="text-gray-600 mt-2">Project Management System</p>
          </div>

          {/* Error Message */}
          {(localError || error) && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                {localError || (error as any)?.response?.data?.error?.message || 'An error occurred'}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@cutm.ac.in"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="password123"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Users */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Demo Users (use password: password123)</h3>
            <div className="space-y-2">
              {demoUsers.map((demoUser) => (
                <button
                  key={demoUser.email}
                  onClick={() => {
                    setEmail(demoUser.email);
                    setPassword('password123');
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition border border-gray-200"
                >
                  <span className="font-medium">{demoUser.role}</span>
                  <span className="text-gray-500 ml-2">{demoUser.email}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 This is a demo using Mock Service Worker (MSW). All API calls are intercepted and mocked. No real
              authentication occurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
