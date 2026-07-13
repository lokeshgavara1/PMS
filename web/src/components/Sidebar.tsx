import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/app';
import { useCurrentUser, useLogout } from '../api';
import { useRole } from '../hooks';
import centurionLogo from '../assets/cutm-logo.png';
import { HomeIcon, TasksIcon, ProjectsIcon, ReportsIcon, TimesheetIcon, WorkflowIcon, AdminIcon, SettingsIcon, LogoutIcon, HodDashboardIcon } from './SidebarIcons';

export default function Sidebar() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
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
    { label: 'Home', path: '/dashboard', icon: HomeIcon },
    { label: 'My Tasks', path: '/my-tasks', icon: TasksIcon },
    { label: 'Projects', path: '/projects', icon: ProjectsIcon },
    { label: 'Reports', path: '/reports', icon: ReportsIcon },
    { label: 'Timesheet', path: '/timesheet', icon: TimesheetIcon },
    { label: 'Workflow', path: '/workflow', icon: WorkflowIcon },
  ];

  // Add Admin and HOD-specific menus
  if (hasRole(['admin', 'hod'])) {
    navItems.push({ label: 'HOD Dashboard', path: '/hod/dashboard', icon: HodDashboardIcon });
    navItems.push({ label: 'Admin', path: '/admin', icon: AdminIcon });
  }

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-teal-500 border-r border-teal-600 transition-all duration-300 flex flex-col overflow-y-auto shadow-lg`}
      style={{
        '--tooltip-width': '100px',
      } as React.CSSProperties}
    >
      <style>{`
        .sidebar-nav-item:hover .sidebar-tooltip {
          opacity: 1;
          visibility: visible;
        }
        .sidebar-tooltip {
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s, visibility 0.2s;
        }
      `}</style>
      {/* Logo */}
      <div className="px-4 border-b border-teal-600 flex items-center justify-between gap-2" style={{height: '80px'}}>
        {sidebarOpen && (
          <div className="flex items-center gap-3 flex-1">
            <img src={centurionLogo} alt="Centurion University" className="h-10 w-auto flex-shrink-0" />
            <h2 className="text-sm font-bold text-white">CUTM PMS</h2>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-white hover:text-teal-600 text-white rounded-lg transition duration-200 flex-shrink-0"
          title="Toggle sidebar"
        >
          {sidebarOpen ? (
            <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          ) : (
            <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <div
            key={item.path}
            className="relative sidebar-nav-item"
            title={!sidebarOpen ? item.label : undefined}
          >
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                isActive(item.path)
                  ? 'bg-white text-teal-600 font-semibold shadow-md'
                  : 'text-white hover:text-teal-600 hover:bg-white hover:shadow-md'
              }`}
            >
              <span className="flex-shrink-0">
                <item.icon size={20} className={isActive(item.path) ? 'text-teal-600' : 'text-white'} />
              </span>
              {sidebarOpen && <span className="flex-1 text-sm">{item.label}</span>}
              {sidebarOpen && isActive(item.path) && (
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
              )}
            </Link>
            {!sidebarOpen && (
              <div className="sidebar-tooltip absolute left-20 top-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap pointer-events-none z-50">
                {item.label}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Menu - Logout only */}
      <div className="border-t border-teal-600 p-4 space-y-3 bg-teal-600">
        {sidebarOpen && user && (
          <div className="px-2 py-3 bg-teal-500 bg-opacity-20 rounded-lg border border-teal-500 border-opacity-30">
            <p className="font-semibold text-white truncate text-sm">{user.name}</p>
            <p className="text-sky-teal-500 text-xs truncate mt-1">{user.email}</p>
            <span className="inline-block mt-2 px-2 py-1 bg-teal-500 bg-opacity-30 text-sky-teal-500 text-xs font-medium rounded-md capitalize">
              {user.system_role}
            </span>
          </div>
        )}
        <Link
          to="/settings"
          className={`w-full flex items-center gap-3 px-4 py-3 text-white hover:text-teal-600 hover:bg-white hover:shadow-md rounded-lg transition duration-200 font-medium text-sm ${
            !sidebarOpen && 'justify-center'
          }`}
          title="Settings"
        >
          <span className="flex-shrink-0">
            <SettingsIcon size={20} className="text-white group-hover:text-teal-600" />
          </span>
          {sidebarOpen && <span>Settings</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:text-white hover:bg-red-600 rounded-lg transition duration-200 font-medium text-sm ${
            !sidebarOpen && 'justify-center'
          }`}
          title="Logout"
        >
          <span className="flex-shrink-0">
            <LogoutIcon size={20} className="text-red-300 group-hover:text-white" />
          </span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
