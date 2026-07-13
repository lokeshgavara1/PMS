import React, { useState } from 'react';
import { useLogTime, useTaskTimeLogs } from '../api';
import { useAppStore } from '../stores/app';

interface TimeLogFormProps {
  taskId: number;
  onClose?: () => void;
}

export default function TimeLogForm({ taskId, onClose }: TimeLogFormProps) {
  const { data: timeLogs } = useTaskTimeLogs(taskId);
  const { mutate: logTime, isLoading: isLogging } = useLogTime(taskId);
  const { addToast } = useAppStore();

  const [formData, setFormData] = useState({
    hours: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.hours || parseFloat(formData.hours) <= 0) {
      addToast('Hours must be greater than 0', 'error');
      return;
    }

    logTime(
      {
        hours: parseFloat(formData.hours),
        date: formData.date,
        notes: formData.notes,
      },
      {
        onSuccess: () => {
          addToast('Time logged successfully', 'success');
          setFormData({
            hours: '',
            date: new Date().toISOString().split('T')[0],
            notes: '',
          });
          onClose?.();
        },
        onError: (error: any) => {
          addToast(error.response?.data?.error?.message || 'Failed to log time', 'error');
        },
      }
    );
  };

  const totalHours = timeLogs?.reduce((sum: number, log: any) => sum + (log.hours || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Time Log Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Log Time</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                placeholder="e.g., 2.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="What did you work on?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={2}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLogging || !formData.hours}
            className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLogging ? 'Logging...' : 'Log Time'}
          </button>
        </div>
      </form>

      {/* Time Logs Summary */}
      <div className="bg-teal-50 rounded-lg border border-teal-200 p-4">
        <p className="text-sm font-medium text-teal-900">
          Total Logged: <span className="font-bold text-lg">{totalHours.toFixed(1)}h</span>
        </p>
        {timeLogs && timeLogs.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-teal-800 uppercase">Recent Logs:</p>
            {timeLogs.slice(0, 5).map((log: any) => (
              <div key={log.id} className="text-xs text-teal-700 flex justify-between">
                <span>{new Date(log.date).toLocaleDateString()}: {log.hours}h</span>
                {log.notes && <span className="italic">{log.notes.slice(0, 20)}...</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
