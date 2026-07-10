import React, { useState } from 'react';
import { useUnreadNotificationCount, useNotifications } from '../api';

export default function NotificationBell() {
  const { data: notifData } = useUnreadNotificationCount();
  const { data: notifications = [] } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifData?.unreadCount || 0;

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
        title="Notifications"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>

          {notifications.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {notifications.slice(0, 10).map((notif: any) => (
                <div
                  key={notif.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                    !notif.read_at ? 'bg-teal-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-900 font-medium flex-1">{notif.message}</p>
                    {!notif.read_at && (
                      <div className="w-2 h-2 bg-teal-600 rounded-full flex-shrink-0 ml-2 mt-1"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-sm">No notifications yet</p>
            </div>
          )}

          <div className="p-3 border-t border-gray-200 text-center">
            <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              View All Notifications →
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
