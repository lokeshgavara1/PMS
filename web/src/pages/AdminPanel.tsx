import React, { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser } from '../api';
import DashboardLayout from '../layouts/DashboardLayout';
import { useRole } from '../hooks';
import { UsersIcon, SettingsIcon, FolderIcon, CheckIcon, EditIcon as EditIconSVG } from '../components/SidebarIcons';

export default function AdminPanel() {
  const { data: usersData } = useUsers();
  const { mutate: createUser } = useCreateUser();
  const { mutate: updateUser } = useUpdateUser(0);
  const { permissions } = useRole();

  const [activeTab, setActiveTab] = useState<'users' | 'workflow' | 'departments'>('users');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    name: '',
    system_role: 'student',
    department_id: 1,
  });

  const [workflowRules, setWorkflowRules] = useState([
    { id: 1, name: 'Student Submission', status: 'enabled', description: 'Students submit project deliverables' },
    { id: 2, name: 'Faculty Review', status: 'enabled', description: 'Faculty reviews and grades submissions' },
    { id: 3, name: 'HOD Approval', status: 'enabled', description: 'HOD approves final grades' },
  ]);

  const [departments, setDepartments] = useState([
    { id: 1, name: 'Computer Science', code: 'CS', hod: 'Prof. Smith' },
    { id: 2, name: 'Electronics', code: 'EC', hod: 'Prof. Johnson' },
    { id: 3, name: 'Mechanical', code: 'ME', hod: 'Prof. Williams' },
  ]);

  const users = usersData?.data || [];

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId) {
      updateUser(
        { id: editingUserId, ...userForm } as any,
        {
          onSuccess: () => {
            setUserForm({ email: '', password: '', name: '', system_role: 'student', department_id: 1 });
            setShowUserForm(false);
            setEditingUserId(null);
          },
        }
      );
    } else {
      createUser(userForm as any, {
        onSuccess: () => {
          setUserForm({ email: '', password: '', name: '', system_role: 'student', department_id: 1 });
          setShowUserForm(false);
        },
      });
    }
  };

  const handleEditUser = (user: any) => {
    setUserForm({
      email: user.email,
      password: '',
      name: user.name,
      system_role: user.system_role,
      department_id: user.department_id || 1,
    });
    setEditingUserId(user.id);
    setShowUserForm(true);
  };

  const handleCancelEdit = () => {
    setUserForm({ email: '', password: '', name: '', system_role: 'student', department_id: 1 });
    setShowUserForm(false);
    setEditingUserId(null);
  };

  const handleDisableUser = (userId: number) => {
    if (confirm('Are you sure you want to disable this user?')) {
      updateUser(
        { id: userId, is_active: false } as any,
        {
          onSuccess: () => {
            alert('User disabled successfully');
          },
        }
      );
    }
  };

  const handleToggleWorkflow = (id: number) => {
    setWorkflowRules(workflowRules.map(r =>
      r.id === id ? { ...r, status: r.status === 'enabled' ? 'disabled' : 'enabled' } : r
    ));
  };

  const handleAddDepartment = () => {
    const newDept = {
      id: Math.max(...departments.map(d => d.id), 0) + 1,
      name: 'New Department',
      code: 'ND',
      hod: 'TBD',
    };
    setDepartments([...departments, newDept]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-1">Manage users, workflows, and system configuration</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-6 py-4 text-center font-medium flex items-center justify-center gap-2 ${
                activeTab === 'users'
                  ? 'text-teal-500 border-b-2 border-teal-500'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <UsersIcon size={18} className={activeTab === 'users' ? 'text-teal-500' : 'text-gray-700'} />
              User Management
            </button>
            <button
              onClick={() => setActiveTab('workflow')}
              className={`flex-1 px-6 py-4 text-center font-medium flex items-center justify-center gap-2 ${
                activeTab === 'workflow'
                  ? 'text-teal-500 border-b-2 border-teal-500'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <SettingsIcon size={18} className={activeTab === 'workflow' ? 'text-teal-500' : 'text-gray-700'} />
              Workflow Config
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`flex-1 px-6 py-4 text-center font-medium flex items-center justify-center gap-2 ${
                activeTab === 'departments'
                  ? 'text-teal-500 border-b-2 border-teal-500'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <FolderIcon size={18} className={activeTab === 'departments' ? 'text-teal-500' : 'text-gray-700'} />
              Departments
            </button>
          </div>
        </div>

        {/* User Management */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Create/Edit User Form */}
            {showUserForm && (
              <div className="bg-white rounded-lg shadow p-6 border-2 border-teal-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{editingUserId ? 'Edit User' : 'Create New User'}</h2>
                <form onSubmit={handleSaveUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={userForm.name}
                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                        placeholder="Full name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        placeholder="user@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <input
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">System Role</label>
                      <select
                        value={userForm.system_role}
                        onChange={(e) => setUserForm({ ...userForm, system_role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="pm">Project Manager</option>
                        <option value="hod">HOD</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                    >
                      {editingUserId ? 'Update User' : 'Create User'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!showUserForm && permissions.canCreateUser && (
              <button
                onClick={() => setShowUserForm(true)}
                className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium"
              >
                + Create New User
              </button>
            )}

            {!showUserForm && !permissions.canCreateUser && (
              <div className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg text-sm">
                Only admins can create users
              </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900">All Users ({users.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user: any) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {user.system_role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          {permissions.canEditUser && (
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-teal-500 hover:text-teal-600 font-medium"
                            >
                              Edit
                            </button>
                          )}
                          {permissions.canDeleteUser && (
                            <button
                              onClick={() => handleDisableUser(user.id)}
                              className="text-red-600 hover:text-red-700 font-medium"
                            >
                              Disable
                            </button>
                          )}
                          {!permissions.canEditUser && !permissions.canDeleteUser && (
                            <span className="text-gray-400 text-xs">No permissions</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Workflow Configuration */}
        {activeTab === 'workflow' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Workflow Rules</h2>
              <p className="text-sm text-gray-600 mt-1">Configure approval workflows and automation rules</p>
            </div>
            <div className="divide-y divide-gray-200">
              {workflowRules.map((rule) => (
                <div key={rule.id} className="p-6 hover:bg-gray-50 flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      rule.status === 'enabled'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.status === 'enabled' ? '✓ Enabled' : '✕ Disabled'}
                    </span>
                    <button
                      onClick={() => handleToggleWorkflow(rule.id)}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        rule.status === 'enabled'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {rule.status === 'enabled' ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Department Management */}
        {activeTab === 'departments' && (
          <div className="space-y-6">
            <button
              onClick={handleAddDepartment}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              + Add Department
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((dept) => (
                <div key={dept.id} className="bg-white rounded-lg shadow p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{dept.name}</h3>
                    <p className="text-sm text-gray-600">Code: {dept.code}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">HOD</label>
                      <input
                        type="text"
                        defaultValue={dept.hod}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 px-3 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 text-sm font-medium">
                        Edit
                      </button>
                      <button className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
