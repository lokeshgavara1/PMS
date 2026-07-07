import { useState } from 'react';
import { useCurrentUser } from '../api';
import { ShieldIcon } from '../components/SidebarIcons';

export default function ProfilePage() {
  const { data: user } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.system_role || '',
    department: 'Computer Science',
    phone: '+91 98765 43210',
    bio: 'Passionate about project management and team collaboration',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // API call would go here
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-100 text-red-700',
      hod: 'bg-purple-100 text-purple-700',
      faculty: 'bg-sky-blue-100 text-teal-600',
      pm: 'bg-green-100 text-green-700',
      student: 'bg-yellow-100 text-yellow-700',
    };
    return colors[role?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-sky-blue-50 via-white to-beige-50 rounded-lg p-8 border border-teal-100">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-sky-blue-500 to-navy-500 rounded-full flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">{user?.name || 'User Name'}</h2>
            <p className="text-teal-500">{user?.email || 'user@cutm.ac.in'}</p>
            <div className="flex gap-2 mt-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(user?.system_role || '')}`}>
                {user?.system_role?.toUpperCase() || 'ROLE'}
              </span>
              <span className="px-3 py-1 bg-sky-blue-100 text-teal-600 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">👤</span> Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{formData.name || user?.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{formData.email || user?.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{formData.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🔐</span> Account Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${getRoleColor(user?.system_role || '')}`}>
                {user?.system_role?.toUpperCase() || 'ROLE'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{formData.department}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <p className="text-gray-900 font-medium">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">✍️</span> Bio
        </h3>
        {isEditing ? (
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        ) : (
          <p className="text-gray-700">{formData.bio}</p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-sky-blue-50 to-beige-50 rounded-lg p-6 border border-teal-100">
          <p className="text-gray-600 text-sm font-medium">Total Projects</p>
          <p className="text-3xl font-bold text-teal-500 mt-2">8</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
          <p className="text-gray-600 text-sm font-medium">Active Tasks</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">12</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
          <p className="text-gray-600 text-sm font-medium">Completed Tasks</p>
          <p className="text-3xl font-bold text-green-600 mt-2">45</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
          <p className="text-gray-600 text-sm font-medium">Hours Logged</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">156</p>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ShieldIcon size={24} className="text-gray-900" />
          Security & Password
        </h3>
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">Secure your account with a strong password</p>
          <button className="px-6 py-2 border-2 border-blue-600 text-teal-500 rounded-lg hover:bg-teal-50 transition font-medium">
            Change Password
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Save Changes
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
