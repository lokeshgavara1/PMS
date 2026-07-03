import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/app';
import { useCurrentUser, useLogout } from '../api';

export default function Sidebar() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const currentUser = useAppStore((state) => state.currentUser);
  const { data: user } = useCurrentUser();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: '🏠' },
    { label: 'My Tasks', path: '/my-tasks', icon: '✓' },
    { label: 'Projects', path: '/projects', icon: '📊' },
    { label: 'Reports', path: '/reports', icon: '📈' },
    { label: 'Timesheet', path: '/timesheet', icon: '⏱️' },
    { label: 'Workflow', path: '/workflow', icon: '📋' },
  ];

  // Add Admin menu only for admins
  if (user?.system_role === 'admin' || user?.system_role === 'hod') {
    navItems.push({ label: 'Admin', path: '/admin', icon: '⚙️' });
  }

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 transition-all duration-300 flex flex-col overflow-y-auto`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
        {sidebarOpen && <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">CUTM-PMS</h1>}
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-slate-200 text-slate-600 rounded-lg transition"
          title="Toggle sidebar"
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
            title={item.label}
          >
            <span className="text-xl">{item.icon}</span>
            {sidebarOpen && <span className="flex-1">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User Menu */}
      <div className="border-t border-slate-200 p-4 space-y-2 bg-slate-50">
        {sidebarOpen && user && (
          <div className="text-sm">
            <p className="font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-slate-500 text-xs truncate">{user.email}</p>
            <p className="text-slate-400 text-xs capitalize">{user.system_role}</p>
          </div>
        )}
        <Link
          to="/profile"
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${
            isActive('/profile') ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold' : 'text-blue-600 hover:bg-blue-100'
          } ${!sidebarOpen && 'justify-center'}`}
          title="Profile"
        >
          <span>👤</span>
          {sidebarOpen && <span>Profile</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg transition ${
            !sidebarOpen && 'justify-center'
          }`}
          title="Logout"
        >
          <span>🚪</span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
