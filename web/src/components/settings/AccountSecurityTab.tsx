import { useState } from 'react';

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface ApiToken {
  id: string;
  name: string;
  created: string;
  lastUsed: string;
}

export default function AccountSecurityTab() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showTwoFASetup, setShowTwoFASetup] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'Bhubaneswar, India',
      lastActive: '2 minutes ago',
      current: true,
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'Bhubaneswar, India',
      lastActive: '1 hour ago',
      current: false,
    },
    {
      id: '3',
      device: 'Chrome on Mac',
      location: 'New Delhi, India',
      lastActive: '2 days ago',
      current: false,
    },
  ]);
  const [apiTokens, setApiTokens] = useState<ApiToken[]>([
    {
      id: '1',
      name: 'Mobile App',
      created: '2026-01-15',
      lastUsed: '5 minutes ago',
    },
    {
      id: '2',
      name: 'Analytics Tool',
      created: '2025-12-20',
      lastUsed: '1 day ago',
    },
  ]);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      alert('Passwords do not match');
      return;
    }
    alert('Password changed successfully');
    setPassword({ current: '', new: '', confirm: '' });
    setShowPasswordForm(false);
  };

  const handleLogoutSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    alert('Session logged out');
  };

  const handleLogoutAllSessions = () => {
    setSessions(sessions.filter((s) => s.current));
    alert('All other sessions logged out');
  };

  const handleDeleteToken = (tokenId: string) => {
    setApiTokens(apiTokens.filter((t) => t.id !== tokenId));
    alert('API token revoked');
  };

  const handleEnable2FA = () => {
    setShowTwoFASetup(true);
  };

  const handleConfirm2FA = () => {
    setTwoFAEnabled(true);
    setShowTwoFASetup(false);
    alert('Two-factor authentication enabled');
  };

  return (
    <div className="space-y-8">
      {/* Change Password Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>

        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Update Password
          </button>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                value={password.current}
                onChange={(e) => setPassword({ ...password, current: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={password.new}
                onChange={(e) => setPassword({ ...password, new: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">At least 12 characters, with uppercase, lowercase, numbers</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={password.confirm}
                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Update Password
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* Two-Factor Authentication */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-700 font-medium">Status: {twoFAEnabled ? '✓ Enabled' : '✗ Disabled'}</p>
              <p className="text-sm text-gray-600 mt-1">
                Add an extra layer of security to your account using an authenticator app.
              </p>
            </div>
            <button
              onClick={handleEnable2FA}
              disabled={twoFAEnabled}
              className={`px-4 py-2 rounded-lg transition font-medium ${
                twoFAEnabled
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {twoFAEnabled ? 'Enabled' : 'Enable 2FA'}
            </button>
          </div>

          {showTwoFASetup && !twoFAEnabled && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-300">
              <h4 className="font-semibold text-gray-900 mb-3">Setup Two-Factor Authentication</h4>
              <ol className="text-sm text-gray-700 space-y-2 mb-4">
                <li>1. Download an authenticator app (Google Authenticator, Authy, Microsoft Authenticator)</li>
                <li>2. Scan this QR code: [QR Code would be here]</li>
                <li>3. Enter the 6-digit code from your app</li>
              </ol>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={handleConfirm2FA}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Verify & Enable
                </button>
                <button
                  onClick={() => setShowTwoFASetup(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Active Sessions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
        <p className="text-sm text-gray-600 mb-4">Manage your active sessions across devices</p>

        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{session.device}</p>
                    {session.current && <span className="text-xs bg-sky-blue-100 text-teal-600 px-2 py-1 rounded">Current</span>}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">📍 {session.location}</p>
                  <p className="text-sm text-gray-500 mt-1">Last active: {session.lastActive}</p>
                </div>
                {!session.current && (
                  <button
                    onClick={() => handleLogoutSession(session.id)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition text-sm font-medium"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleLogoutAllSessions}
          className="mt-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition font-medium"
        >
          Logout All Other Sessions
        </button>
      </div>

      <hr className="border-gray-200" />

      {/* API Tokens */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Tokens</h3>
        <p className="text-sm text-gray-600 mb-4">Manage access tokens for third-party integrations</p>

        <div className="space-y-3">
          {apiTokens.map((token) => (
            <div key={token.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{token.name}</p>
                  <p className="text-sm text-gray-600 mt-1">Created: {token.created}</p>
                  <p className="text-sm text-gray-500">Last used: {token.lastUsed}</p>
                </div>
                <button
                  onClick={() => handleDeleteToken(token.id)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition text-sm font-medium"
                >
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          + Create New Token
        </button>
      </div>

      <hr className="border-gray-200" />

      {/* Login History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Login History</h3>
        <p className="text-sm text-gray-600 mb-4">Recent login activity to your account</p>

        <div className="space-y-2 text-sm">
          <div className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">Chrome on Windows</p>
              <p className="text-gray-600">192.168.1.100 • Bhubaneswar</p>
            </div>
            <p className="text-gray-500">Today, 2:30 PM</p>
          </div>
          <div className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">Safari on iPhone</p>
              <p className="text-gray-600">192.168.1.101 • Bhubaneswar</p>
            </div>
            <p className="text-gray-500">Today, 1:15 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
