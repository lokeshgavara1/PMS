import { useState } from 'react';
import { useUpdateTaskStatus } from '../api';
import { TaskStatus } from '../types';

interface Task {
  id: number;
  project_id: number;
  sprint_id?: number;
  parent_id?: number;
  title: string;
  description?: string;
  type: string;
  priority: string;
  status: typeof TaskStatus[keyof typeof TaskStatus];
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

interface KanbanBoardProps {
  projectId: number;
  tasks: Task[];
}

const COLUMNS: { status: typeof TaskStatus[keyof typeof TaskStatus]; label: string; color: string }[] = [
  { status: TaskStatus.BACKLOG, label: 'Backlog', color: 'bg-gray-50' },
  { status: TaskStatus.TODO, label: 'To Do', color: 'bg-teal-50' },
  { status: TaskStatus.IN_PROGRESS, label: 'In Progress', color: 'bg-yellow-50' },
  { status: TaskStatus.REVIEW, label: 'Review', color: 'bg-purple-50' },
  { status: TaskStatus.DONE, label: 'Done', color: 'bg-green-50' },
];

export default function KanbanBoard({ projectId: _projectId, tasks }: KanbanBoardProps) {
  const { mutate: updateStatus } = useUpdateTaskStatus(0); // Will update with actual task ID
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: typeof TaskStatus[keyof typeof TaskStatus]) => {
    if (draggedTask && draggedTask.status !== status) {
      updateStatus(status, {
        onSuccess: () => {
          setDraggedTask(null);
        },
      });
    }
    setDraggedTask(null);
  };

  return (
    <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((column) => (
        <div
          key={column.status}
          className={`${column.color} rounded-lg p-4 min-w-[300px] min-h-[600px] border border-gray-200`}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(column.status)}
        >
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">{column.label}</h3>
            <p className="text-sm text-gray-500">
              {tasks.filter((t) => t.status === column.status).length} tasks
            </p>
          </div>

          <div className="space-y-3">
            {tasks
              .filter((t) => t.status === column.status)
              .map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md cursor-move transition border-l-4 border-teal-500"
                >
                  <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {task.type}
                    </span>
                    <span className={`text-xs font-bold ${
                      task.priority === 'critical' ? 'text-red-600' :
                      task.priority === 'high' ? 'text-orange-600' :
                      task.priority === 'medium' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
