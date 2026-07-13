import { useState } from 'react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  inApp: boolean;
  icon: string;
}

interface QuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export default function NotificationPreferencesTab() {
  const [digestFrequency, setDigestFrequency] = useState<'realtime' | 'daily' | 'weekly'>('daily');
  const [quietHours, setQuietHours] = useState<QuietHours>({
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
  });

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: '1',
      title: 'Task Assigned',
      description: 'When a new task is assigned to you',
      email: true,
      inApp: true,
      icon: '✓',
    },
    {
      id: '2',
      title: 'Task Due Soon',
      description: 'Reminder before task deadline',
      email: true,
      inApp: true,
      icon: '⏰',
    },
    {
      id: '3',
      title: 'Submission Received',
      description: 'When you receive a new submission (faculty only)',
      email: true,
      inApp: true,
      icon: '📥',
    },
    {
      id: '4',
      title: 'Review Published',
      description: 'When faculty publishes a review of your work',
      email: true,
      inApp: true,
      icon: '📋',
    },
    {
      id: '5',
      title: 'Revision Requested',
      description: 'When faculty requests revisions',
      email: true,
      inApp: true,
      icon: '✏️',
    },
    {
      id: '6',
      title: 'Comment on My Work',
      description: 'When someone comments on your submission',
      email: false,
      inApp: true,
      icon: '💬',
    },
    {
      id: '7',
      title: 'Mentioned',
      description: 'When you are @mentioned in comments',
      email: true,
      inApp: true,
      icon: '@',
    },
    {
      id: '8',
      title: 'Project Updated',
      description: 'When project details are changed',
      email: false,
      inApp: true,
      icon: '📝',
    },
    {
      id: '9',
      title: 'Sprint Started',
      description: 'When a new sprint begins',
      email: false,
      inApp: true,
      icon: '🏃',
    },
    {
      id: '10',
      title: 'Milestone Completed',
      description: 'When a milestone is marked complete',
      email: false,
      inApp: true,
      icon: '🎯',
    },
  ]);

  const handleToggleNotification = (id: string, type: 'email' | 'inApp') => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, [type]: !notif[type] } : notif
      )
    );
  };

  const handleToggleQuietHours = () => {
    setQuietHours({ ...quietHours, enabled: !quietHours.enabled });
  };

  return (
    <div className="space-y-8">
      {/* Digest Frequency */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Frequency</h3>
        <p className="text-sm text-gray-600 mb-4">How often do you want to receive notification digests?</p>

        <div className="space-y-3">
          {[
            { value: 'realtime' as const, label: 'Real-time', description: 'Immediate notifications as they happen' },
            { value: 'daily' as const, label: 'Daily Digest', description: 'One summary email per day' },
            { value: 'weekly' as const, label: 'Weekly Digest', description: 'One summary email per week' },
          ].map((option) => (
            <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-teal-50">
              <input
                type="radio"
                name="digestFrequency"
                value={option.value}
                checked={digestFrequency === option.value}
                onChange={(e) => setDigestFrequency(e.target.value as any)}
                className="w-4 h-4 text-teal-500"
              />
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Quiet Hours */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiet Hours</h3>
        <p className="text-sm text-gray-600 mb-4">Don't send notifications during these hours</p>

        <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Enable Quiet Hours</p>
              <p className="text-sm text-gray-600">Stop notifications between specific times</p>
            </div>
            <button
              onClick={handleToggleQuietHours}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                quietHours.enabled ? 'bg-teal-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={quietHours.startTime}
                  onChange={(e) => setQuietHours({ ...quietHours, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  value={quietHours.endTime}
                  onChange={(e) => setQuietHours({ ...quietHours, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Notification Types */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
        <p className="text-sm text-gray-600 mb-4">Choose which notifications you want to receive and how</p>

        <div className="space-y-4">
          {/* Toggle All */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-900">All Notifications</p>
              <div className="flex gap-4">
                <button className="px-3 py-1 text-sm text-teal-500 hover:text-teal-600 font-medium">
                  Enable All
                </button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 font-medium">
                  Disable All
                </button>
              </div>
            </div>
          </div>

          {/* Individual Notifications */}
          {notifications.map((notif) => (
            <div key={notif.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{notif.icon}</span>
                    <p className="font-medium text-gray-900">{notif.title}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notif.description}</p>
                </div>
              </div>

              <div className="flex gap-4 ml-6">
                {/* Email Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notif.email}
                    onChange={() => handleToggleNotification(notif.id, 'email')}
                    className="w-4 h-4 text-teal-500 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">📧 Email</span>
                </label>

                {/* In-App Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notif.inApp}
                    onChange={() => handleToggleNotification(notif.id, 'inApp')}
                    className="w-4 h-4 text-teal-500 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">🔔 In-App</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Notification Channels */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
        <p className="text-sm text-gray-600 mb-4">Choose how you want to receive notifications</p>

        <div className="space-y-3">
          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-teal-50">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-teal-500 rounded focus:ring-teal-500"
            />
            <div className="ml-3 flex-1">
              <p className="font-medium text-gray-900">📧 Email Notifications</p>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
          </label>

          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-teal-50">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-teal-500 rounded focus:ring-teal-500"
            />
            <div className="ml-3 flex-1">
              <p className="font-medium text-gray-900">🔔 In-App Notifications</p>
              <p className="text-sm text-gray-600">Receive notifications in the app</p>
            </div>
          </label>

          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-teal-50">
            <input
              type="checkbox"
              className="w-4 h-4 text-teal-500 rounded focus:ring-teal-500"
            />
            <div className="ml-3 flex-1">
              <p className="font-medium text-gray-900">📱 Push Notifications</p>
              <p className="text-sm text-gray-600">Receive mobile push notifications (beta)</p>
            </div>
          </label>

          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-teal-50">
            <input
              type="checkbox"
              className="w-4 h-4 text-teal-500 rounded focus:ring-teal-500"
            />
            <div className="ml-3 flex-1">
              <p className="font-medium text-gray-900">💬 SMS Notifications</p>
              <p className="text-sm text-gray-600">Critical notifications via SMS (requires setup)</p>
            </div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium">
          Save Preferences
        </button>
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
