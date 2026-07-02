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

  const validateEmail = (emailToCheck: string): boolean => {
    const validDomains = ['cutm.ac.in', 'cutmap.ac.in'];
    const domain = emailToCheck.split('@')[1];
    return validDomains.includes(domain);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setLocalError('Please use your official cutm.ac.in or cutmap.ac.in email address');
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

  const handleGoogleSignIn = () => {
    // In production, this would initiate OAuth flow
    // For now, show a message
    setLocalError('Google sign-in will be available soon. Use demo users to test.');
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

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700 mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or use email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Email (cutm.ac.in / cutmap.ac.in)</label>
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
