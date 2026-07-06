import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/app';
import { useCurrentUser, useLogout } from '../api';
import { useRole } from '../hooks';
import centurionLogo from '../assets/cutm-logo.png';

export default function Sidebar() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const currentUser = useAppStore((state) => state.currentUser);
  const { data: user } = useCurrentUser();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const { hasRole } = useRole();

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

  // Add Admin and HOD-specific menus
  if (hasRole(['admin', 'hod'])) {
    navItems.push({ label: 'HOD Dashboard', path: '/hod/dashboard', icon: '📊' });
    navItems.push({ label: 'Admin', path: '/admin', icon: '⚙️' });
  }

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-gradient-to-b from-navy via-navy-dark to-navy border-r border-navy-dark transition-all duration-300 flex flex-col overflow-y-auto shadow-lg`}
    >
      {/* Logo */}
      <div className="px-4 border-b border-navy-dark flex items-center justify-between gap-2" style={{height: '80px'}}>
        {sidebarOpen && (
          <div className="flex items-center gap-3 flex-1">
            <img src={centurionLogo} alt="Centurion University" className="h-10 w-auto flex-shrink-0" />
            <h2 className="text-sm font-bold text-white">CUTM PMS</h2>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-teal hover:text-white text-sky-blue rounded-lg transition duration-200 flex-shrink-0"
          title="Toggle sidebar"
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
              isActive(item.path)
                ? 'bg-teal text-white font-semibold shadow-md'
                : 'text-white hover:text-white hover:bg-teal hover:shadow-md'
            }`}
            title={item.label}
          >
            <span className="text-xl">{item.icon}</span>
            {sidebarOpen && <span className="flex-1 text-sm">{item.label}</span>}
            {sidebarOpen && isActive(item.path) && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* User Menu - Logout only */}
      <div className="border-t border-navy-dark p-4 space-y-3 bg-navy-dark">
        {sidebarOpen && user && (
          <div className="px-2 py-3 bg-teal bg-opacity-20 rounded-lg border border-teal border-opacity-30">
            <p className="font-semibold text-white truncate text-sm">{user.name}</p>
            <p className="text-sky-blue text-xs truncate mt-1">{user.email}</p>
            <span className="inline-block mt-2 px-2 py-1 bg-teal bg-opacity-30 text-sky-blue text-xs font-medium rounded-md capitalize">
              {user.system_role}
            </span>
          </div>
        )}
        <Link
          to="/settings"
          className={`w-full flex items-center gap-3 px-4 py-3 text-white hover:text-white hover:bg-teal hover:shadow-md rounded-lg transition duration-200 font-medium text-sm ${
            !sidebarOpen && 'justify-center'
          }`}
          title="Settings"
        >
          <span>⚙️</span>
          {sidebarOpen && <span>Settings</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:text-white hover:bg-red-600 rounded-lg transition duration-200 font-medium text-sm ${
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
