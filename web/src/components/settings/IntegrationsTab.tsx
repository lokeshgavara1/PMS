import React, { useState } from 'react';

interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: 'connected' | 'disconnected';
  connectedDate?: string;
  lastSync?: string;
}

export default function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Google Workspace',
      icon: '🔵',
      description: 'Sync calendar and email',
      status: 'connected',
      connectedDate: '2026-01-10',
      lastSync: '5 minutes ago',
    },
    {
      id: '2',
      name: 'Slack',
      icon: '💜',
      description: 'Send notifications to Slack',
      status: 'disconnected',
    },
    {
      id: '3',
      name: 'GitHub',
      icon: '⚫',
      description: 'Sync code repositories',
      status: 'disconnected',
    },
    {
      id: '4',
      name: 'Microsoft Teams',
      icon: '🟦',
      description: 'Integrate with Teams',
      status: 'disconnected',
    },
    {
      id: '5',
      name: 'Zoom',
      icon: '🔲',
      description: 'Embed Zoom meetings',
      status: 'disconnected',
    },
    {
      id: '6',
      name: 'Dropbox',
      icon: '🔵',
      description: 'Share files from Dropbox',
      status: 'disconnected',
    },
  ]);

  const handleConnect = (id: string) => {
    setIntegrations(
      integrations.map((int) =>
        int.id === id
          ? {
              ...int,
              status: 'connected',
              connectedDate: new Date().toISOString().split('T')[0],
              lastSync: 'Just now',
            }
          : int
      )
    );
    alert(`${integrations.find((i) => i.id === id)?.name} connected!`);
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(
      integrations.map((int) =>
        int.id === id
          ? {
              ...int,
              status: 'disconnected',
              connectedDate: undefined,
              lastSync: undefined,
            }
          : int
      )
    );
    alert('Integration disconnected');
  };

  return (
    <div className="space-y-8">
      {/* Connected Accounts */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Accounts</h3>
        <p className="text-sm text-gray-600 mb-4">Manage integrations with external services</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className={`p-4 border rounded-lg ${
                integration.status === 'connected'
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{integration.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{integration.name}</p>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    integration.status === 'connected'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {integration.status === 'connected' ? '✓ Connected' : 'Disconnected'}
                </span>
              </div>

              {integration.status === 'connected' ? (
                <div>
                  <div className="text-xs text-gray-600 space-y-1 mb-3">
                    <p>Connected: {integration.connectedDate}</p>
                    <p>Last sync: {integration.lastSync}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDisconnect(integration.id)}
                      className="flex-1 px-3 py-2 text-red-600 hover:bg-red-50 border border-red-300 rounded transition text-sm font-medium"
                    >
                      Disconnect
                    </button>
                    <button className="flex-1 px-3 py-2 text-teal-500 hover:bg-teal-50 border border-teal-300 rounded transition text-sm font-medium">
                      Settings
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(integration.id)}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
                >
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Calendar Integration */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendar Synchronization</h3>
        <p className="text-sm text-gray-600 mb-4">Sync your CUTM-PMS calendar with external calendars</p>

        <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Sync with Google Calendar</p>
              <p className="text-sm text-gray-600">Automatically add deadlines to your Google Calendar</p>
            </div>
            <button
              // onClick={handleToggle}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
            >
              Enable Sync
            </button>
          </div>

          <div className="text-sm text-gray-700 bg-white p-3 rounded">
            <p className="font-medium mb-2">Which events sync:</p>
            <ul className="space-y-1 text-gray-600">
              <li>✓ Project deadlines</li>
              <li>✓ Milestone due dates</li>
              <li>✓ Task deadlines</li>
              <li>✓ Submission deadlines</li>
              <li>✗ Faculty meetings</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 bg-teal-50 p-4 rounded-lg border border-teal-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Sync with Outlook Calendar</p>
              <p className="text-sm text-gray-600">Automatically add deadlines to your Outlook Calendar</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
              Enable Sync
            </button>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Email Forwarding */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
        <p className="text-sm text-gray-600 mb-4">Forward notifications to an external email</p>

        <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked={false}
              className="w-4 h-4 text-teal-500 rounded focus:ring-teal-500"
            />
            <span className="font-medium text-gray-900">Forward to external email</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="your-email@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-xs text-gray-500 mt-1">A verification email will be sent</p>
          </div>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            Save Email Address
          </button>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Webhook Settings (Advanced) */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhooks (Advanced)</h3>
        <p className="text-sm text-gray-600 mb-4">Get real-time notifications when specific events occur</p>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700 mb-4">
            Configure webhooks to receive HTTP POST requests when important events happen in your projects.
          </p>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            + Add Webhook
          </button>

          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-900">Active Webhooks:</p>
            <p className="text-sm text-gray-600">None configured</p>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Available Integrations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse Integrations</h3>
        <p className="text-sm text-gray-600 mb-4">Discover more integrations from our marketplace</p>

        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          Browse Integration Marketplace →
        </button>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          Save Integration Settings
        </button>
      </div>
    </div>
  );
}
