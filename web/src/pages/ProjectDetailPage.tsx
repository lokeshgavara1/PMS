import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProject, useProjectTasks, useProjectSprints } from '../api';
import DashboardLayout from '../layouts/DashboardLayout';
import KanbanBoard from '../components/KanbanBoard';
import BacklogView from '../components/BacklogView';
import GanttChart from '../components/GanttChart';

type Tab = 'board' | 'backlog' | 'sprints' | 'gantt' | 'activity' | 'settings';

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const id = projectId ? parseInt(projectId) : null;

  const { data: project, isLoading: projectLoading } = useProject(id);
  const { data: tasksData } = useProjectTasks(id);
  const { data: sprints } = useProjectSprints(id);

  const [activeTab, setActiveTab] = useState<Tab>('board');
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>('backlog');

  if (projectLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading project...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Project not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const tasks = tasksData?.data || [];
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'board', label: 'Board', icon: '📊' },
    { id: 'backlog', label: 'Backlog', icon: '📋' },
    { id: 'sprints', label: 'Sprints', icon: '⚡' },
    { id: 'gantt', label: 'Gantt', icon: '📅' },
    { id: 'activity', label: 'Activity', icon: '📝' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600 mt-1">{project.description}</p>
          <div className="flex gap-4 mt-3">
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
              {project.category}
            </span>
            <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
              {project.status}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'board' && <KanbanBoard projectId={id!} tasks={tasks} />}
          {activeTab === 'backlog' && <BacklogView projectId={id!} tasks={tasks} sprints={sprints || []} />}
          {activeTab === 'gantt' && <GanttChart projectId={id!} />}
          {activeTab === 'sprints' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Sprints</h2>
              {sprints && sprints.length > 0 ? (
                <div className="space-y-4">
                  {sprints.map((sprint) => (
                    <div key={sprint.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{sprint.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{sprint.description}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span>{sprint.start_date} to {sprint.end_date}</span>
                            <span className="capitalize">{sprint.status}</span>
                            {sprint.velocity && <span>Velocity: {sprint.velocity}</span>}
                          </div>
                        </div>
                        <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded">
                          {sprint.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No sprints yet</p>
              )}
            </div>
          )}
          {activeTab === 'activity' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Activity Log</h2>
              <p className="text-gray-500">Activity log coming soon</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Project Settings</h2>
              <p className="text-gray-500">Settings coming soon</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
