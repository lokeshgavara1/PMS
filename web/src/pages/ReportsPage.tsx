import { useState } from 'react';
import { useProjects, useProjectTasks } from '../api';
import DashboardLayout from '../layouts/DashboardLayout';

export default function ReportsPage() {
  const { data: projectsData } = useProjects(1, 100);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const { data: tasksData } = useProjectTasks(selectedProjectId);

  const projects = projectsData?.data || [];
  const tasks = tasksData?.data || [];

  // Burndown data
    { status: 'Backlog', count: tasks.filter(t => t.status === 'backlog').length || 3 },
    { status: 'Todo', count: tasks.filter(t => t.status === 'todo').length || 4 },
    { status: 'In Progress', count: tasks.filter(t => t.status === 'in_progress').length || 2 },
    { status: 'Review', count: tasks.filter(t => t.status === 'review').length || 1 },
    { status: 'Done', count: tasks.filter(t => t.status === 'done').length || 5 },
  ];

  const handleExportCSV = () => {
    const csv = [
      ['Task', 'Status', 'Priority', 'Assignee', 'Due Date'],
      ...tasks.map(t => [
        t.title,
        t.status,
        t.priority,
        t.assignee_id || 'Unassigned',
        t.due_date || 'N/A'
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Project metrics and performance tracking</p>
        </div>

        {/* Project Selector */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">Select Project</label>
          <select
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Burndown Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Sprint Burndown</h2>
            <div className="h-[300px] bg-gray-100 rounded flex items-center justify-center text-gray-500">
              [Burndown chart visualization]
            </div>
          </div>

          {/* Workload Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Team Workload</h2>
            <div className="h-[300px] bg-gray-100 rounded flex items-center justify-center text-gray-500">
              [Workload chart visualization]
            </div>
          </div>

          {/* Task Status Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Task Status Distribution</h2>
            <div className="h-[300px] bg-gray-100 rounded flex items-center justify-center text-gray-500">
              [Task status chart visualization]
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-teal-50 rounded">
                <span className="text-gray-700">Total Tasks</span>
                <span className="text-2xl font-bold text-teal-500">{tasks.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="text-gray-700">Completed</span>
                <span className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.status === 'done').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                <span className="text-gray-700">In Progress</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {tasks.filter(t => t.status === 'in_progress').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                <span className="text-gray-700">Completion Rate</span>
                <span className="text-2xl font-bold text-red-600">
                  {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="bg-white rounded-lg shadow p-6">
          <button
            onClick={handleExportCSV}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            📥 Export as CSV
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
