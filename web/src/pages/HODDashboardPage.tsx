import React, { useState, useEffect } from 'react';

interface ProjectStats {
  id: number;
  name: string;
  status: string;
  owner_id: number;
  start_date: string;
  end_date: string;
  total_tasks: number;
  completed_tasks: number;
  completion_rate: number;
  total_estimated_hours: number;
}

export default function HODDashboardPage() {
  const [projects, setProjects] = useState<ProjectStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v2';
      const response = await fetch(`${baseUrl}/hod/dashboard`);
      const data = await response.json();
      if (data.success) {
        setProjects(data.data.projects || []);
      }
    } catch (err) {
      console.error('Failed to load HOD dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (filter === 'active') return project.status === 'active';
    if (filter === 'completed') return project.status === 'completed';
    return true;
  });

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const avgCompletionRate = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + p.completion_rate, 0) / projects.length)
    : 0;

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">HOD Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of all projects and their progress</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl shadow p-6 text-gray-900 border border-teal-100">
          <p className="text-teal-600 text-sm font-semibold">Total Projects</p>
          <p className="text-4xl font-bold text-teal-600 mt-2">{totalProjects}</p>
          <p className="text-teal-500 text-sm mt-2">Across all departments</p>
        </div>

        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl shadow p-6 text-gray-900 border border-green-200">
          <p className="text-green-700 text-sm font-semibold">Active Projects</p>
          <p className="text-4xl font-bold text-green-700 mt-2">{activeProjects}</p>
          <p className="text-green-600 text-sm mt-2">Currently in progress</p>
        </div>

        <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl shadow p-6 text-gray-900 border border-purple-200">
          <p className="text-purple-700 text-sm font-semibold">Completed</p>
          <p className="text-4xl font-bold text-purple-700 mt-2">{completedProjects}</p>
          <p className="text-purple-600 text-sm mt-2">Successfully closed</p>
        </div>

        <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl shadow p-6 text-gray-900 border border-orange-200">
          <p className="text-orange-700 text-sm font-semibold">Avg Completion</p>
          <p className="text-4xl font-bold text-orange-700 mt-2">{avgCompletionRate}%</p>
          <p className="text-orange-600 text-sm mt-2">Overall progress rate</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              filter === 'all'
                ? 'border-blue-500 text-teal-500'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              filter === 'active'
                ? 'border-blue-500 text-teal-500'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              filter === 'completed'
                ? 'border-blue-500 text-teal-500'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Started: {new Date(project.start_date).toLocaleDateString()} •
                    Ends: {new Date(project.end_date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-lg ${
                  project.status === 'active' ? 'bg-green-100 text-green-700' :
                  project.status === 'completed' ? 'bg-sky-blue-100 text-teal-600' :
                  project.status === 'planning' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {project.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Task Completion</p>
                  <p className="text-sm font-bold text-gray-900">{project.completion_rate}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.completion_rate}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-teal-500">{project.completed_tasks}/{project.total_tasks}</p>
                  <p className="text-xs text-gray-600 mt-1">Tasks Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-indigo-600">{project.total_estimated_hours}</p>
                  <p className="text-xs text-gray-600 mt-1">Est. Hours</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{project.total_tasks - project.completed_tasks}</p>
                  <p className="text-xs text-gray-600 mt-1">Remaining</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No projects found with the selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
