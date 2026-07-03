import React, { useState } from 'react';

interface AccessibilitySettings {
  fontSize: 'small' | 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  screenReader: boolean;
  reduceMotion: boolean;
  focusIndicator: boolean;
  dyslexiaFont: boolean;
  keyboardShortcuts: boolean;
}

export default function AccessibilityTab() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    highContrast: false,
    screenReader: false,
    reduceMotion: false,
    focusIndicator: true,
    dyslexiaFont: false,
    keyboardShortcuts: true,
  });

  const handleChange = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleToggle = (field: string) => {
    setSettings({ ...settings, [field]: !settings[field] });
  };

  return (
    <div className="space-y-8">
      {/* Font Size */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Text Size</h3>
        <p className="text-sm text-gray-600 mb-4">Adjust the size of text throughout the interface</p>

        <div className="space-y-3">
          {[
            { value: 'small' as const, label: 'Small', preview: 'The quick brown fox' },
            { value: 'normal' as const, label: 'Normal (Default)', preview: 'The quick brown fox' },
            { value: 'large' as const, label: 'Large', preview: 'The quick brown fox' },
            { value: 'xlarge' as const, label: 'Extra Large', preview: 'The quick brown fox' },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50"
            >
              <input
                type="radio"
                name="fontSize"
                value={option.value}
                checked={settings.fontSize === option.value}
                onChange={() => handleChange('fontSize', option.value)}
                className="w-4 h-4 text-blue-600"
              />
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-900">{option.label}</p>
                <p
                  className="mt-1"
                  style={{
                    fontSize:
                      option.value === 'small'
                        ? '12px'
                        : option.value === 'normal'
                          ? '14px'
                          : option.value === 'large'
                            ? '16px'
                            : '18px',
                  }}
                >
                  {option.preview}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Visual Accessibility */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Accessibility</h3>
        <p className="text-sm text-gray-600 mb-4">Adjust visual display for better readability</p>

        <div className="space-y-4">
          {/* High Contrast */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">High Contrast Mode</p>
                <p className="text-sm text-gray-600">Increase color contrast for better readability</p>
              </div>
              <button
                onClick={() => handleToggle('highContrast')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  settings.highContrast ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Focus Indicator */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Enhanced Focus Indicator</p>
                <p className="text-sm text-gray-600">Make keyboard focus more visible</p>
              </div>
              <button
                onClick={() => handleToggle('focusIndicator')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  settings.focusIndicator ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.focusIndicator ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Dyslexia Font */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Dyslexia-Friendly Font</p>
                <p className="text-sm text-gray-600">Use OpenDyslexic font for easier reading</p>
              </div>
              <button
                onClick={() => handleToggle('dyslexiaFont')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  settings.dyslexiaFont ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.dyslexiaFont ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Motion & Animation */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Motion & Animation</h3>
        <p className="text-sm text-gray-600 mb-4">Control motion effects to prevent dizziness</p>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Reduce Motion</p>
              <p className="text-sm text-gray-600">Minimize animations and transitions</p>
            </div>
            <button
              onClick={() => handleToggle('reduceMotion')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.reduceMotion ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.reduceMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Screen Reader Support */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Screen Reader Support</h3>
        <p className="text-sm text-gray-600 mb-4">Optimize experience for screen readers</p>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Screen Reader Mode</p>
                <p className="text-sm text-gray-600">Enhance announcements for screen reader users</p>
              </div>
              <button
                onClick={() => handleToggle('screenReader')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  settings.screenReader ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.screenReader ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {settings.screenReader && (
              <div className="text-sm text-gray-700 mt-3 bg-white p-3 rounded">
                <p className="font-medium mb-2">When enabled:</p>
                <ul className="space-y-1 text-gray-600">
                  <li>✓ Enhanced landmark announcements</li>
                  <li>✓ Additional form labels</li>
                  <li>✓ Table headers announced</li>
                  <li>✓ Verbose button descriptions</li>
                  <li>✓ Alerts announced immediately</li>
                </ul>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 mb-3">
              <strong>Compatible Screen Readers:</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ NVDA (Windows)</li>
              <li>✓ JAWS (Windows)</li>
              <li>✓ VoiceOver (macOS, iOS)</li>
              <li>✓ TalkBack (Android)</li>
            </ul>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Keyboard Navigation */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyboard Navigation</h3>
        <p className="text-sm text-gray-600 mb-4">Keyboard shortcuts and navigation options</p>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900">Keyboard Shortcuts</p>
                <p className="text-sm text-gray-600">Enable keyboard shortcuts for quick actions</p>
              </div>
              <button
                onClick={() => handleToggle('keyboardShortcuts')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  settings.keyboardShortcuts ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.keyboardShortcuts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {settings.keyboardShortcuts && (
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View Keyboard Shortcut Help →
              </button>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-900 mb-3">Common Shortcuts:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <code className="bg-gray-200 px-2 py-1 rounded">Alt + S</code>
                <span className="text-gray-600 ml-2">Save</span>
              </div>
              <div>
                <code className="bg-gray-200 px-2 py-1 rounded">Alt + C</code>
                <span className="text-gray-600 ml-2">Create new</span>
              </div>
              <div>
                <code className="bg-gray-200 px-2 py-1 rounded">Alt + /</code>
                <span className="text-gray-600 ml-2">Show all shortcuts</span>
              </div>
              <div>
                <code className="bg-gray-200 px-2 py-1 rounded">Alt + K</code>
                <span className="text-gray-600 ml-2">Quick search</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Accessibility Resources */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learn More</h3>
        <p className="text-sm text-gray-600 mb-4">Resources to help you use CUTM-PMS accessibly</p>

        <div className="space-y-3">
          <a
            href="#"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
          >
            <span className="text-lg mr-3">📖</span>
            <div>
              <p className="font-medium text-gray-900">Accessibility Guide</p>
              <p className="text-sm text-gray-600">Learn about accessibility features</p>
            </div>
          </a>

          <a
            href="#"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
          >
            <span className="text-lg mr-3">⌨️</span>
            <div>
              <p className="font-medium text-gray-900">Keyboard Shortcuts Reference</p>
              <p className="text-sm text-gray-600">View all available keyboard shortcuts</p>
            </div>
          </a>

          <a
            href="#"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
          >
            <span className="text-lg mr-3">🎓</span>
            <div>
              <p className="font-medium text-gray-900">WCAG 2.1 Compliance</p>
              <p className="text-sm text-gray-600">View our accessibility compliance statement</p>
            </div>
          </a>

          <a
            href="#"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
          >
            <span className="text-lg mr-3">💬</span>
            <div>
              <p className="font-medium text-gray-900">Report Accessibility Issue</p>
              <p className="text-sm text-gray-600">Help us improve accessibility</p>
            </div>
          </a>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          Save Accessibility Settings
        </button>
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
