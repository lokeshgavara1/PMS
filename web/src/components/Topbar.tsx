import React, { useState } from 'react';
import { useUnreadNotificationCount, useNotifications } from '../api';
import { useCurrentUser } from '../api';

export default function Topbar() {
  const { data: user } = useCurrentUser();
  const { data: unreadCount } = useUnreadNotificationCount();
  const { data: notifications } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const unread = unreadCount?.unreadCount || 0;

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white">CUTM Project Management System</h2>
        <p className="text-sm text-blue-200">Welcome back, {user?.name}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-blue-200 hover:bg-blue-800 rounded-lg transition"
            title="Notifications"
          >
            🔔
            {unread > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications && notifications.length > 0 ? (
                  notifications.slice(0, 10).map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-gray-100 ${
                        notif.is_read ? 'bg-white' : 'bg-blue-50'
                      }`}
                    >
                      <p className="text-sm text-gray-900">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    No notifications
                  </div>
                )}
              </div>
              <div className="px-4 py-3 border-t border-gray-200 text-center">
                <button className="text-blue-600 text-sm hover:underline">View all</button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-white flex items-center justify-center font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-sm">
              <p className="font-semibold text-white">{user.name}</p>
              <p className="text-blue-200 capitalize text-xs">{user.system_role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
