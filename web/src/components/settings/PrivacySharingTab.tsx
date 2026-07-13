import { useState } from 'react';

type VisibilityLevel = 'private' | 'internal' | 'public';

interface PrivacySettings {
  profileVisibility: VisibilityLevel;
  searchIndexing: boolean;
  dataSharing: boolean;
  emailVisibility: VisibilityLevel;
  workVisibility: VisibilityLevel;
}

export default function PrivacySharingTab() {
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'internal',
    searchIndexing: true,
    dataSharing: false,
    emailVisibility: 'internal',
    workVisibility: 'internal',
  });

  const handleVisibilityChange = (field: keyof PrivacySettings, value: VisibilityLevel) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleToggle = (field: keyof PrivacySettings) => {
    setSettings({ ...settings, [field]: !settings[field] });
  };

  const visibilityOptions = [
    {
      value: 'private' as const,
      label: '🔒 Private',
      description: 'Only you can see',
    },
    {
      value: 'internal' as const,
      label: '👥 Internal',
      description: 'Only authenticated users in your institution',
    },
    {
      value: 'public' as const,
      label: '🌐 Public',
      description: 'Anyone on the internet can see',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Visibility */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Visibility</h3>
        <p className="text-sm text-gray-600 mb-4">Control who can see your profile information</p>

        <div className="space-y-3">
          {visibilityOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-teal-50"
            >
              <input
                type="radio"
                name="profileVisibility"
                value={option.value}
                checked={settings.profileVisibility === option.value}
                onChange={() => handleVisibilityChange('profileVisibility', option.value)}
                className="w-4 h-4 text-teal-500"
              />
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </label>
          ))}
        </div>

        {settings.profileVisibility === 'public' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            ⚠️ Your profile is publicly visible. Anyone can see your name, email, and profile picture.
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* Email Visibility */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Visibility</h3>
        <p className="text-sm text-gray-600 mb-4">Who can see your email address?</p>

        <div className="space-y-3">
          {visibilityOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-teal-50"
            >
              <input
                type="radio"
                name="emailVisibility"
                value={option.value}
                checked={settings.emailVisibility === option.value}
                onChange={() => handleVisibilityChange('emailVisibility', option.value)}
                className="w-4 h-4 text-teal-500"
              />
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </label>
          ))}
        </div>

        {settings.emailVisibility !== 'private' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            ⚠️ Your email is visible. You may receive messages from other users.
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* Work Visibility */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Work Visibility</h3>
        <p className="text-sm text-gray-600 mb-4">Who can see your projects, tasks, and submissions?</p>

        <div className="space-y-3">
          {visibilityOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-teal-50"
            >
              <input
                type="radio"
                name="workVisibility"
                value={option.value}
                checked={settings.workVisibility === option.value}
                onChange={() => handleVisibilityChange('workVisibility', option.value)}
                className="w-4 h-4 text-teal-500"
              />
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </label>
          ))}
        </div>

        {settings.workVisibility === 'public' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            ⚠️ Your work is publicly visible. Anyone can see your projects and submissions.
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* Data Sharing */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data & Analytics</h3>
        <p className="text-sm text-gray-600 mb-4">Help improve CUTM-PMS by sharing anonymous usage data</p>

        <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Anonymous Analytics</p>
              <p className="text-sm text-gray-600">Share anonymized usage patterns to help us improve</p>
            </div>
            <button
              onClick={() => handleToggle('dataSharing')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.dataSharing ? 'bg-teal-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.dataSharing ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {settings.dataSharing && (
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-medium">📊 We collect (anonymously):</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Page load times</li>
                <li>Feature usage patterns</li>
                <li>Error frequencies</li>
                <li>Search queries (without content)</li>
                <li>Device and browser type</li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                Your personal data (name, email, submissions) is never shared. <a href="#" className="text-teal-500 hover:text-teal-600">Learn more</a>
              </p>
            </div>
          )}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Search Indexing */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Engine Indexing</h3>
        <p className="text-sm text-gray-600 mb-4">Allow search engines to index your public profile</p>

        <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Index my profile</p>
              <p className="text-sm text-gray-600">Allow Google and other search engines to find your profile</p>
            </div>
            <button
              onClick={() => handleToggle('searchIndexing')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.searchIndexing ? 'bg-teal-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.searchIndexing ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {!settings.searchIndexing && (
            <p className="text-sm text-gray-600 mt-3">
              ✓ Your profile will not appear in search results or be crawled by search engines.
            </p>
          )}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Data Download & Export */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <p className="text-sm text-gray-600 mb-4">Download your data or request deletion</p>

        <div className="space-y-3">
          <button className="w-full p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition text-left">
            <p className="font-medium text-gray-900">📥 Download My Data</p>
            <p className="text-sm text-gray-600 mt-1">Get a copy of your profile, submissions, and activity</p>
          </button>

          <button className="w-full p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition text-left">
            <p className="font-medium text-gray-900">📊 Export as CSV</p>
            <p className="text-sm text-gray-600 mt-1">Export your work and grades for external use</p>
          </button>

          <button className="w-full p-4 border border-red-300 rounded-lg hover:bg-red-50 transition text-left">
            <p className="font-medium text-red-600">🗑️ Request Account Deletion</p>
            <p className="text-sm text-red-600 mt-1">Permanently delete your account and data</p>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium">
          Save Privacy Settings
        </button>
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
          Cancel
        </button>
      </div>
    </div>
  );
}
