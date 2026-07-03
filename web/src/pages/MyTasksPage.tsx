import React, { useState } from 'react';
import { useCurrentUser, useUpdateTaskStatus } from '../api';

export default function MyTasksPage() {
  const { data: user } = useCurrentUser();
  const { mutate: updateStatus } = useUpdateTaskStatus(0);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Mock tasks data - in production this would come from API
  const myTasks = [
    {
      id: 1,
      title: 'Setup project dashboard',
      description: 'Create the main dashboard UI with widgets',
      type: 'feature',
      priority: 'high',
      status: 'in_progress',
      assignee_id: user?.id,
      due_date: '2026-07-10',
      estimate_hours: 8,
    },
    {
      id: 2,
      title: 'API authentication',
      description: 'Implement JWT-based authentication',
      type: 'feature',
      priority: 'critical',
      status: 'todo',
      assignee_id: user?.id,
      due_date: '2026-07-08',
      estimate_hours: 12,
    },
    {
      id: 3,
      title: 'User profile page',
      description: 'Build user settings and profile editor',
      type: 'feature',
      priority: 'medium',
      status: 'done',
      assignee_id: user?.id,
      due_date: '2026-07-05',
      estimate_hours: 6,
    },
    {
      id: 4,
      title: 'Email notifications',
      description: 'Setup email notification system',
      type: 'task',
      priority: 'medium',
      status: 'review',
      assignee_id: user?.id,
      due_date: '2026-07-12',
      estimate_hours: 4,
    },
  ].filter((task) => task.assignee_id === user?.id);

  let filteredTasks = myTasks;
  if (filterStatus !== 'all') {
    filteredTasks = filteredTasks.filter((t: any) => t.status === filterStatus);
  }
  if (filterPriority !== 'all') {
    filteredTasks = filteredTasks.filter((t: any) => t.priority === filterPriority);
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      backlog: 'bg-gray-100 text-gray-700',
      todo: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-yellow-100 text-yellow-700',
      review: 'bg-purple-100 text-purple-700',
      done: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: 'text-red-600 font-bold',
      high: 'text-orange-600 font-semibold',
      medium: 'text-yellow-600 font-medium',
      low: 'text-gray-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  const handleStatusChange = (taskId: number, newStatus: string) => {
    updateStatus(newStatus as any);
  };

  const stats = {
    total: myTasks.length,
    inProgress: myTasks.filter((t: any) => t.status === 'in_progress').length,
    completed: myTasks.filter((t: any) => t.status === 'done').length,
    pending: myTasks.filter((t: any) => t.status === 'todo' || t.status === 'backlog').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 mt-1">Manage and track your assigned tasks</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">In Progress</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Pending</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Completed</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Priority</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredTasks.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredTasks.map((task: any) => (
              <div
                key={task.id}
                className="p-6 hover:bg-gray-50 transition border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <p className="text-gray-600 mt-1 text-sm">{task.description}</p>

                    <div className="flex gap-3 mt-3">
                      <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {task.type}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getPriorityColor(
                        task.priority
                      )}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                      {task.due_date && (
                        <span className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className={`px-4 py-2 rounded-lg font-medium border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                        task.status
                      )}`}
                    >
                      <option value="backlog">Backlog</option>
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>

                {task.estimate_hours && (
                  <div className="mt-3 text-xs text-gray-500">
                    ⏱️ Estimate: {task.estimate_hours} hours
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-600 text-lg">
              {myTasks.length === 0
                ? '📭 No tasks assigned to you yet'
                : '🎯 No tasks match your filters'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
