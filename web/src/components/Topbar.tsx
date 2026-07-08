import { useState } from 'react';
import { useUnreadNotificationCount, useNotifications, useLogout } from '../api';
import { useCurrentUser } from '../api';
import { useNavigate } from 'react-router-dom';
import { NotificationIcon } from './SidebarIcons';

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
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login', { replace: true });
      },
    });
  };

  const unread = unreadCount?.unreadCount || 0;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6 shadow-sm">
      <h1 className="text-sm font-semibold text-gray-700 tracking-tight flex-1 text-center">Centurion University of Technology and Management</h1>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-navy-500 hover:bg-beige-100 rounded-lg transition duration-200"
            title="Notifications"
          >
            <NotificationIcon size={20} className="text-navy-500" />
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
              className="flex items-center gap-3 px-3 py-2 hover:bg-beige-100 rounded-lg transition duration-200 group"
              title="Profile menu"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-500 to-teal-500 text-white flex items-center justify-center font-bold cursor-pointer shadow-lg group-hover:shadow-xl transition">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col items-start gap-1">
                <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize shadow-sm ${
                  user.system_role === 'admin' ? 'bg-red-100 text-red-700' :
                  user.system_role === 'hod' ? 'bg-purple-100 text-purple-700' :
                  user.system_role === 'faculty' ? 'bg-blue-100 text-blue-700' :
                  user.system_role === 'student' ? 'bg-green-100 text-green-700' :
                  user.system_role === 'pm' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {user.system_role}
                </span>
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
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy-500 to-teal-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
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
