import React, { useState } from 'react';

interface DisplaySettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12' | '24';
  itemsPerPage: number;
  sidebarCollapsed: boolean;
  compactView: boolean;
}

export default function DisplayPreferencesTab() {
  const [settings, setSettings] = useState<DisplaySettings>({
    theme: 'light',
    language: 'en-US',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24',
    itemsPerPage: 20,
    sidebarCollapsed: false,
    compactView: false,
  });

  const handleChange = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleToggle = (field: string) => {
    setSettings({ ...settings, [field]: !settings[field] });
  };

  return (
    <div className="space-y-8">
      {/* Theme Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
        <p className="text-sm text-gray-600 mb-4">Choose your preferred theme</p>

        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'light' as const, label: '☀️ Light', description: 'Light theme (default)' },
            { value: 'dark' as const, label: '🌙 Dark', description: 'Dark theme' },
            { value: 'auto' as const, label: '⚙️ Auto', description: 'Follow system preference' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleChange('theme', option.value)}
              className={`p-4 rounded-lg border-2 transition text-center ${
                settings.theme === option.value
                  ? 'border-blue-600 bg-teal-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-gray-900">{option.label}</p>
              <p className="text-xs text-gray-600 mt-1">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Language Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Language</h3>
        <p className="text-sm text-gray-600 mb-4">Choose your preferred language</p>

        <select
          value={settings.language}
          onChange={(e) => handleChange('language', e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="en-US">🇺🇸 English (US)</option>
          <option value="en-GB">🇬🇧 English (UK)</option>
          <option value="hi-IN">🇮🇳 हिंदी (Hindi)</option>
          <option value="es-ES">🇪🇸 Español (Spanish)</option>
          <option value="fr-FR">🇫🇷 Français (French)</option>
          <option value="de-DE">🇩🇪 Deutsch (German)</option>
          <option value="ja-JP">🇯🇵 日本語 (Japanese)</option>
          <option value="zh-CN">🇨🇳 中文 (Simplified Chinese)</option>
        </select>
      </div>

      <hr className="border-gray-200" />

      {/* Timezone */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timezone</h3>
        <p className="text-sm text-gray-600 mb-4">Set your timezone for correct date/time display</p>

        <select
          value={settings.timezone}
          onChange={(e) => handleChange('timezone', e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="Asia/Kolkata">🇮🇳 Asia/Kolkata (IST, UTC+5:30)</option>
          <option value="Asia/Kolkata">🇮🇳 Asia/Kolkata (IST, UTC+5:30)</option>
          <option value="UTC">UTC (Coordinated Universal Time)</option>
          <option value="America/New_York">🇺🇸 America/New_York (EST, UTC-5)</option>
          <option value="Europe/London">🇬🇧 Europe/London (GMT, UTC+0)</option>
          <option value="Europe/Paris">🇫🇷 Europe/Paris (CET, UTC+1)</option>
          <option value="Asia/Tokyo">🇯🇵 Asia/Tokyo (JST, UTC+9)</option>
          <option value="Australia/Sydney">🇦🇺 Australia/Sydney (AEST, UTC+10)</option>
        </select>

        <p className="text-xs text-gray-500 mt-2">Current time: {new Date().toLocaleString()}</p>
      </div>

      <hr className="border-gray-200" />

      {/* Date & Time Format */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Date & Time Format</h3>
        <p className="text-sm text-gray-600 mb-4">How dates and times appear throughout the system</p>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select
              value={settings.dateFormat}
              onChange={(e) => handleChange('dateFormat', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (15/07/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (07/15/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-07-15)</option>
              <option value="DD MMM YYYY">DD MMM YYYY (15 Jul 2026)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="timeFormat"
                  value="24"
                  checked={settings.timeFormat === '24'}
                  onChange={() => handleChange('timeFormat', '24')}
                  className="w-4 h-4 text-teal-500"
                />
                <span className="text-sm text-gray-700">24-hour (14:30)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="timeFormat"
                  value="12"
                  checked={settings.timeFormat === '12'}
                  onChange={() => handleChange('timeFormat', '12')}
                  className="w-4 h-4 text-teal-500"
                />
                <span className="text-sm text-gray-700">12-hour (2:30 PM)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* List View Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">List View</h3>
        <p className="text-sm text-gray-600 mb-4">Configure how items appear in lists</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Items Per Page</label>
            <select
              value={settings.itemsPerPage}
              onChange={(e) => handleChange('itemsPerPage', parseInt(e.target.value))}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value={10}>10 items</option>
              <option value={20}>20 items</option>
              <option value={50}>50 items</option>
              <option value={100}>100 items</option>
            </select>
          </div>

          <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Compact View</p>
                <p className="text-sm text-gray-600">Show more items with less spacing</p>
              </div>
              <button
                onClick={() => handleToggle('compactView')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  settings.compactView ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.compactView ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Sidebar Behavior */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
        <p className="text-sm text-gray-600 mb-4">Configure sidebar and navigation behavior</p>

        <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Collapse Sidebar by Default</p>
              <p className="text-sm text-gray-600">Start with the sidebar closed</p>
            </div>
            <button
              onClick={() => handleToggle('sidebarCollapsed')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.sidebarCollapsed ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.sidebarCollapsed ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Preview */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Example with your selected settings:</p>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Date:</strong> 15/07/2026 ({settings.dateFormat === 'DD/MM/YYYY' ? 'DD/MM/YYYY' : 'format'})
            </p>
            <p>
              <strong>Time:</strong> {settings.timeFormat === '24' ? '14:30' : '2:30 PM'}
            </p>
            <p>
              <strong>Timezone:</strong> {settings.timezone}
            </p>
            <p>
              <strong>Language:</strong> {settings.language}
            </p>
            <p>
              <strong>Theme:</strong> {settings.theme === 'auto' ? 'System preference' : settings.theme}
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          Save Display Preferences
        </button>
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
