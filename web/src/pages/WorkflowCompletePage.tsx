import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface ProjectMember {
  id: number;
  name: string;
  email: string;
  system_role: string;
}

interface Task {
  id: number;
  title: string;
  status: string;
  approval_status: string;
  assignee_id: number;
}

interface Timesheet {
  id: number;
  user_id: number;
  week_start: string;
  total_hours: number;
}

export default function WorkflowCompletePage() {
  const { projectId } = useParams();
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [activeTab, setActiveTab] = useState<'members' | 'tasks' | 'timesheets'>('members');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [approvalNotes, setApprovalNotes] = useState('');

  const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v2';

  useEffect(() => {
    loadProjectMembers();
    loadProjectTasks();
    loadTimesheets();
  }, [projectId]);

  const loadProjectMembers = async () => {
    try {
      const response = await fetch(`${baseUrl}/projects/${projectId}/members`);
      const data = await response.json();
      if (data.success) {
        setMembers(data.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load project members:', err);
    }
  };

  const loadProjectTasks = async () => {
    try {
      const response = await fetch(`${baseUrl}/projects/${projectId}/tasks`);
      const data = await response.json();
      if (data.success) {
        setTasks(data.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  };

  const loadTimesheets = async () => {
    try {
      const response = await fetch(`${baseUrl}/timesheets/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      });
      const data = await response.json();
      if (data.success) {
        setTimesheets([data.data.timesheet]);
      }
    } catch (err) {
      console.error('Failed to load timesheets:', err);
    }
  };

  const handleTaskApproval = async (taskId: number) => {
    try {
      const response = await fetch(`${baseUrl}/tasks/${taskId}/approval`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approval_status: approvalStatus,
          approval_notes: approvalNotes
        })
      });
      if (response.ok) {
        setApprovalNotes('');
        setSelectedTaskId(null);
        loadProjectTasks();
        alert('Task approval updated successfully');
      }
    } catch (err) {
      console.error('Failed to update task approval:', err);
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Project Workflow Complete</h1>
        <p className="text-gray-600 mt-1">Manage project members, task approvals, and timesheets</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('members')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'members'
                ? 'border-teal-500 text-teal-500'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Project Members
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tasks'
                ? 'border-teal-500 text-teal-500'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Task Approvals
          </button>
          <button
            onClick={() => setActiveTab('timesheets')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'timesheets'
                ? 'border-teal-500 text-teal-500'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Timesheets
          </button>
        </div>
      </div>

      {/* Project Members Tab */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Project Members</h2>
          {members.length > 0 ? (
            <div className="grid gap-4">
              {members.map((member) => (
                <div key={member.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <span className="inline-block mt-2 px-2 py-1 bg-sky-teal-100 text-teal-600 text-xs font-medium rounded">
                        {member.system_role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No members added yet</p>
          )}
        </div>
      )}

      {/* Task Approvals Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Task Approvals</h2>
          {tasks.length > 0 ? (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-600">Status: {task.status}</p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${
                        task.approval_status === 'approved' ? 'bg-green-100 text-green-700' :
                        task.approval_status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {task.approval_status}
                      </span>
                    </div>
                    {task.status === 'review' && (
                      <button
                        onClick={() => setSelectedTaskId(task.id)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
                      >
                        Review
                      </button>
                    )}
                  </div>

                  {selectedTaskId === task.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Approval Status</label>
                        <select
                          value={approvalStatus}
                          onChange={(e) => setApprovalStatus(e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <textarea
                          value={approvalNotes}
                          onChange={(e) => setApprovalNotes(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Add approval notes..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTaskApproval(task.id)}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Submit Approval
                        </button>
                        <button
                          onClick={() => setSelectedTaskId(null)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tasks yet</p>
          )}
        </div>
      )}

      {/* Timesheets Tab */}
      {activeTab === 'timesheets' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Timesheet Sync</h2>
          {timesheets.length > 0 ? (
            <div className="grid gap-4">
              {timesheets.map((timesheet) => (
                <div key={timesheet.id} className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-sky-blue-50 to-beige-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Week of {new Date(timesheet.week_start).toLocaleDateString()}</p>
                      <p className="text-2xl font-bold text-teal-500 mt-2">{timesheet.total_hours} hours</p>
                      <p className="text-sm text-gray-600 mt-1">Total hours logged and synced</p>
                    </div>
                    <button
                      onClick={() => loadTimesheets()}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
                    >
                      Sync
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No timesheet data available</p>
          )}
        </div>
      )}
    </div>
  );
}
