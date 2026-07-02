import React, { useState } from 'react';
import { useProjects, useCreateProject } from '../api';
import { useAppStore } from '../stores/app';
import { Link } from 'react-router-dom';
import { ProjectCategory, ProjectVisibility } from '../types';

export default function ProjectsPage() {
  const { data: projectsData, isLoading } = useProjects(1, 20);
  const { mutate: createProject, isLoading: isCreating } = useCreateProject();
  const { modals, openModal, closeModal, addToast } = useAppStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: ProjectCategory.ACADEMIC as ProjectCategory,
    visibility: ProjectVisibility.PUBLIC as ProjectVisibility,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  });

  const projects = projectsData?.data || [];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.end_date) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    createProject(formData, {
      onSuccess: () => {
        addToast('Project created successfully', 'success');
        closeModal('createProject');
        setFormData({
          name: '',
          description: '',
          category: ProjectCategory.ACADEMIC,
          visibility: ProjectVisibility.PUBLIC,
          start_date: new Date().toISOString().split('T')[0],
          end_date: '',
        });
      },
      onError: (error: any) => {
        addToast(error.response?.data?.error?.message || 'Failed to create project', 'error');
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage and collaborate on your projects</p>
        </div>
        <button
          onClick={() => openModal('createProject')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          + New Project
        </button>
      </div>

      {/* Projects List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-l-4 border-blue-500 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">{project.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description?.slice(0, 100)}</p>
                </div>
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {project.category}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
                <span>Status: {project.status}</span>
                <span>End: {new Date(project.end_date).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">No projects yet. Create your first project to get started.</p>
          <button
            onClick={() => openModal('createProject')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium inline-block"
          >
            Create Your First Project
          </button>
        </div>
      )}

      {/* Create Project Modal */}
      {modals.createProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Create Project</h2>
              <button
                onClick={() => closeModal('createProject')}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Project Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Mobile App Development"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Brief description of the project"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={ProjectCategory.ACADEMIC}>Academic</option>
                  <option value={ProjectCategory.RESEARCH}>Research</option>
                  <option value={ProjectCategory.ADMIN}>Admin</option>
                  <option value={ProjectCategory.INFRASTRUCTURE}>Infrastructure</option>
                </select>
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Visibility *</label>
                <select
                  value={formData.visibility}
                  onChange={(e) => setFormData({ ...formData, visibility: e.target.value as ProjectVisibility })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={ProjectVisibility.PRIVATE}>Private</option>
                  <option value={ProjectVisibility.DEPARTMENT}>Department</option>
                  <option value={ProjectVisibility.PUBLIC}>Public</option>
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">End Date *</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => closeModal('createProject')}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

// Toast Container Component
function ToastContainer() {
  const toasts = useAppStore((state) => state.toasts);
  const removeToast = useAppStore((state) => state.removeToast);

  React.useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => {
        removeToast(toast.id);
      }, 3000),
    );

    return () => timers.forEach((t) => clearTimeout(t));
  }, [toasts, removeToast]);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg text-white font-medium shadow-lg ${
            toast.type === 'success'
              ? 'bg-green-500'
              : toast.type === 'error'
                ? 'bg-red-500'
                : toast.type === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-blue-500'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
