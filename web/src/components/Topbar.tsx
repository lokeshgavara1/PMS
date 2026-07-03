import React, { useState } from 'react';
import { useUnreadNotificationCount, useNotifications, useLogout } from '../api';
import { useCurrentUser } from '../api';
import { useNavigate } from 'react-router-dom';
import centurionLogo from '../assets/cutm-logo.png';

export default function Topbar() {
  const { data: user } = useCurrentUser();
  const { data: unreadCount } = useUnreadNotificationCount();
  const { data: notifications } = useNotifications();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

  const unread = unreadCount?.unreadCount || 0;

  return (
    <header className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 border-b border-gray-200 px-8 py-6 flex items-center gap-8 shadow-sm">
      <h1 className="text-lg font-semibold text-gray-900 tracking-tight flex-1 text-center">Centurion University of Technology and Management</h1>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-gray-700 hover:bg-blue-100 rounded-xl transition duration-200"
            title="Notifications"
          >
            <span className="text-xl">🔔</span>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute -left-44 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
                <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
                <p className="text-xs text-gray-600 mt-1">{unread} unread</p>
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                {notifications && notifications.length > 0 ? (
                  notifications.slice(0, 10).map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-5 py-4 hover:bg-gray-50 transition ${
                        notif.is_read ? 'bg-white' : 'bg-indigo-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notif.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-5 py-12 text-center">
                    <p className="text-gray-500 text-sm font-medium">No notifications yet</p>
                  </div>
                )}
              </div>
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-center">
                <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition">View all notifications →</button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar with Profile Menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 px-2 py-1.5 hover:bg-blue-100 rounded-xl transition duration-200 group"
              title="Profile menu"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold cursor-pointer shadow-lg group-hover:shadow-xl transition">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-gray-600 capitalize text-xs font-medium">{user.system_role}</p>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute -left-48 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                {/* Header with close button */}
                <div className="relative p-6 bg-white border-b border-gray-100">
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                  >
                    ✕
                  </button>

                  {/* Profile Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-base">{user.name.toUpperCase()}</p>
                      <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                      <p className="text-sm text-blue-600 font-medium mt-2 capitalize">{user.system_role}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-4 space-y-1">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition duration-150 text-left text-sm"
                  >
                    <span>My Profile</span>
                    <span className="text-gray-400">→</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition duration-150 text-left text-sm"
                  >
                    <span>Account Settings</span>
                    <span className="text-gray-400">→</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition duration-150 text-left text-sm font-medium"
                  >
                    <span>⇒ Sign Out</span>
                    <span></span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </header>
  );
}
