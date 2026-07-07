import React, { useState } from 'react';
import { useCreateTask, useUpdateTask } from '../api';

interface Task {
  id: number;
  project_id: number;
  sprint_id?: number;
  parent_id?: number;
  title: string;
  description?: string;
  type: string;
  priority: string;
  status: string;
  assignee_id?: number;
  reporter_id: number;
  milestone_id?: number;
  due_date?: string;
  estimate_hours?: number;
  position: number;
  is_archived: boolean;
  submission_status?: string;
  created_at: string;
  updated_at: string;
}

interface BacklogViewProps {
  projectId: number;
  tasks: Task[];
  sprints: any[];
}

export default function BacklogView({ projectId, tasks, sprints }: BacklogViewProps) {
  const { mutate: createTask, isLoading: isCreating } = useCreateTask(projectId);
  const { mutate: updateTask } = useUpdateTask(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'task' as const,
    priority: 'medium' as const,
  });

  const backlogTasks = tasks.filter((t) => !t.sprint_id);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    createTask(formData, {
      onSuccess: () => {
        setFormData({ title: '', description: '', type: 'task', priority: 'medium' });
        setShowForm(false);
      },
    });
  };

  const handleMoveToSprint = (_taskId: number, sprintId: number) => {
    updateTask({ sprint_id: sprintId } as any);
  };

  return (
    <div className="space-y-6">
      {/* Create Task Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 border-2 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-4">Create New Task</h3>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Task title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isCreating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Task
        </button>
      )}

      {/* Backlog Tasks */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Backlog ({backlogTasks.length})</h2>
        </div>

        {backlogTasks.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {backlogTasks.map((task) => (
              <div key={task.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {task.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        task.priority === 'critical' ? 'bg-red-100 text-red-700' :
                        task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  {sprints.length > 0 && (
                    <select
                      onChange={(e) => handleMoveToSprint(task.id, parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue=""
                    >
                      <option value="">Move to sprint...</option>
                      {sprints.map((sprint) => (
                        <option key={sprint.id} value={sprint.id}>
                          {sprint.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p>No backlog items. Create a task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
