import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useCurrentUser } from '../api';

// Tab components
import AccountSecurityTab from '../components/settings/AccountSecurityTab';
import NotificationPreferencesTab from '../components/settings/NotificationPreferencesTab';
import PrivacySharingTab from '../components/settings/PrivacySharingTab';
import DisplayPreferencesTab from '../components/settings/DisplayPreferencesTab';
import IntegrationsTab from '../components/settings/IntegrationsTab';
import AccessibilityTab from '../components/settings/AccessibilityTab';

type SettingsTab = 'security' | 'notifications' | 'privacy' | 'display' | 'integrations' | 'accessibility';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('security');
  const { data: user } = useCurrentUser();

  const tabs: { id: SettingsTab; label: string; icon: string; description: string }[] = [
    { id: 'security', label: 'Account Security', icon: '🔒', description: 'Password, 2FA, sessions' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', description: 'Email, in-app alerts' },
    { id: 'privacy', label: 'Privacy & Sharing', icon: '👁️', description: 'Visibility, data sharing' },
    { id: 'display', label: 'Display & Preferences', icon: '🎨', description: 'Theme, language, timezone' },
    { id: 'integrations', label: 'Integrations', icon: '🔗', description: 'Connected accounts' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿', description: 'Fonts, contrast, shortcuts' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and configurations</p>
        </div>

        {/* Settings Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tab Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-0 overflow-hidden sticky top-20">
              <nav className="space-y-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 border-l-4 transition ${
                      activeTab === tab.id
                        ? 'bg-blue-50 border-l-blue-600 text-blue-600 font-semibold'
                        : 'border-l-transparent text-gray-700 hover:bg-gray-50 hover:border-l-gray-300'
                    }`}
                    title={tab.description}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{tab.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{tab.label}</div>
                        <div className="text-xs text-gray-500 hidden sm:block">{tab.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {/* Tab Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-white via-blue-50 to-indigo-50">
                <h2 className="text-xl font-bold text-gray-900">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {tabs.find((t) => t.id === activeTab)?.description}
                </p>
              </div>

              {/* Tab Content Area */}
              <div className="p-6">
                {activeTab === 'security' && <AccountSecurityTab />}
                {activeTab === 'notifications' && <NotificationPreferencesTab />}
                {activeTab === 'privacy' && <PrivacySharingTab />}
                {activeTab === 'display' && <DisplayPreferencesTab />}
                {activeTab === 'integrations' && <IntegrationsTab />}
                {activeTab === 'accessibility' && <AccessibilityTab />}
              </div>
            </div>

            {/* Need Help Section */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-700">Need Help?</h3>
              <p className="text-sm text-blue-600 mt-1">
                For account-related issues, please contact{' '}
                <a href="mailto:support@cutm.ac.in" className="font-semibold text-blue-600 hover:text-blue-700">
                  support@cutm.ac.in
                </a>
                {' '}or visit our{' '}
                <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">
                  knowledge base
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
