import React from 'react';
import { useGanttData } from '../api';

interface GanttChartProps {
  projectId: number;
}

export default function GanttChart({ projectId }: GanttChartProps) {
  const { data: ganttData, isLoading } = useGanttData(projectId);

  if (isLoading) {
    return <div className="text-gray-500">Loading Gantt data...</div>;
  }

  const tasks = ganttData?.tasks || [];

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500">No tasks to display on Gantt chart</p>
      </div>
    );
  }

  // Calculate date range
  const dates = tasks
    .filter((t: any) => t.start)
    .map((t: any) => new Date(t.start));

  if (dates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500">Tasks without dates cannot be displayed on Gantt chart</p>
      </div>
    );
  }

  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  // Generate week headers
  const weeks: Date[] = [];
  const current = new Date(minDate);
  while (current <= maxDate) {
    weeks.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }

  const getTaskPosition = (task: any) => {
    const start = new Date(task.start);
    const daysFromMin = Math.floor(
      (start.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const duration = task.duration || 5;
    const totalDays = Math.floor(
      (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      left: (daysFromMin / totalDays) * 100,
      width: (duration / totalDays) * 100,
    };
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 min-w-[200px]">
                Task Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 min-w-[600px]">
                Timeline
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-200">
            {tasks.map((task: any) => {
              const position = getTaskPosition(task);
              return (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <div className="truncate">{task.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Progress: {task.progress}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative h-8 bg-gray-100 rounded">
                      <div
                        className="absolute top-0 h-full bg-blue-500 rounded flex items-center justify-center text-xs font-medium text-white"
                        style={{
                          left: `${position.left}%`,
                          width: `${position.width}%`,
                        }}
                      >
                        {position.width > 10 && `${task.progress}%`}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Task Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
}
