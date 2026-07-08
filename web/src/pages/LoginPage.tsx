import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin, useCurrentUser } from '../api';
import { useAppStore } from '../stores/app';
import centurionLogo from '../assets/cutm-logo.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutate: googleLogin, isLoading: isGoogleLoading, error: googleError } = useGoogleLogin();
  const { data: user } = useCurrentUser();
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  const [localError, setLocalError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      navigate('/dashboard');
    }
  }, [user, navigate, setCurrentUser]);


  const handleGoogleSignInSuccess = (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      setLocalError('Failed to get authentication token');
      return;
    }

    googleLogin(idToken, {
      onSuccess: (data) => {
        setCurrentUser(data.user);
        navigate('/dashboard');
      },
      onError: (err: any) => {
        setLocalError(
          err.response?.data?.error?.message ||
          'Google sign-in failed. Make sure you use a cutm.ac.in or cutmap.ac.in email.'
        );
      },
    });
  };

  const handleGoogleSignInError = () => {
    setLocalError('Google sign-in failed. Please try again.');
  };

  // Demo users removed - use Google Sign-in or LDAP credentials

  const errorMessage: string = String(localError || (googleError as any)?.response?.data?.error?.message || 'An error occurred');

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Section - Branding */}
      <div className="w-1/2 bg-gradient-to-br from-teal-50 to-white border-r border-teal-100 p-12 flex flex-col justify-between">
        <div>
          {/* Logo and Title */}
          <div className="mb-12 flex items-center gap-4">
            <img src={centurionLogo} alt="Centurion University" className="h-14 w-auto rounded-full flex-shrink-0" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CUTM-PMS</h1>
              <p className="text-teal-500 text-sm">Project Management System</p>
            </div>
          </div>

          {/* Main Heading - Clean and Simple */}
          <div>
            <h2 className="text-5xl font-bold leading-tight mb-3 text-gray-900">
              Manage Projects
              <br />
              <span className="text-teal-500">Smarter & Faster</span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Intelligent task tracking, automated workflows, real-time analytics, and seamless collaboration — all in one platform.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="font-semibold text-gray-900">Smart Tracking</p>
                <p className="text-gray-600 text-sm">Intelligent task tracking and management</p>
              </div>
              <div className="flex flex-col gap-3">
                <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="font-semibold text-gray-900">Fast Workflows</p>
                <p className="text-gray-600 text-sm">Automated processes and automation</p>
              </div>
              <div className="flex flex-col gap-3">
                <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="font-semibold text-gray-900">Real Analytics</p>
                <p className="text-gray-600 text-sm">Real-time insights and reporting</p>
              </div>
              <div className="flex flex-col gap-3">
                <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM15 20H9m6 0h6m-3-3a6 6 0 00-12 0v2a2 2 0 002 2h8a2 2 0 002-2v-2z" />
                </svg>
                <p className="font-semibold text-gray-900">Collaboration</p>
                <p className="text-gray-600 text-sm">Seamless team collaboration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div>

        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-1/2 bg-white p-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Welcome back</h3>
            <p className="text-gray-600 text-base leading-relaxed">Sign in with Google to access your project dashboard</p>
          </div>

          <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-transparent mb-8"></div>

          {/* Error Message */}
          {(localError || googleError) ? (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                {errorMessage}
              </p>
            </div>
          ) : null}

          {/* Google Sign In Button */}
          <div className="w-full mb-6">
            {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
              <div className={isGoogleLoading ? 'opacity-50 pointer-events-none' : ''}>
                <GoogleLogin
                  onSuccess={handleGoogleSignInSuccess}
                  onError={handleGoogleSignInError}
                  text="signin_with"
                  width="100%"
                  
                />
              </div>
            ) : (
              <button
                type="button"
                disabled
                className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed font-medium text-gray-500 mb-6"
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
                Continue with Google (Not Configured)
              </button>
            )}
          </div>



          {/* Supported Domains */}
          <div className="mt-8 p-4 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="text-teal-600 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-teal-900 mb-2">Supported email domains</p>
                <p className="text-xs text-teal-700 leading-relaxed">
                  @cutm.ac.in • @cutmap.ac.in • @thegttech.com • @esse.co.in • @ftl.org.in
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
