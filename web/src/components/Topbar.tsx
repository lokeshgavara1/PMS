import React, { useState } from 'react';
import { useUnreadNotificationCount, useNotifications, useLogout } from '../api';
import { useCurrentUser } from '../api';
import { useNavigate } from 'react-router-dom';

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
    <header className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 border-b border-blue-200/60 px-8 py-5 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <span className="text-lg font-bold text-white">P</span>
        </div>
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent tracking-tight">CUTM PMS</h2>
          <p className="text-xs text-blue-600 font-medium">Project Management System</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition duration-200"
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
            <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
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
                <p className="text-blue-600 capitalize text-xs font-medium">{user.system_role}</p>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-blue-100 z-50 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold mb-3 shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                  <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg capitalize">
                    {user.system_role}
                  </span>
                </div>
                <div className="p-3 space-y-2">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition duration-150 text-left font-medium text-sm"
                  >
                    <span className="text-lg">👤</span>
                    <span>View Profile</span>
                    <span className="ml-auto text-gray-400">→</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition duration-150 text-left font-medium text-sm"
                  >
                    <span className="text-lg">⚙️</span>
                    <span>Settings</span>
                    <span className="ml-auto text-gray-400">→</span>
                  </button>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition duration-150 text-left font-medium text-sm"
                  >
                    <span className="text-lg">🚪</span>
                    <span>Logout</span>
                    <span className="ml-auto text-red-400">→</span>
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
