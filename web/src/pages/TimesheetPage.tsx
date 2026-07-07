import { useState } from 'react';
import { useTimeLogs, useLogTime } from '../api';
import DashboardLayout from '../layouts/DashboardLayout';

export default function TimesheetPage() {
  const { data: timeLogsData } = useTimeLogs();
  const { mutate: logTime } = useLogTime(0);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [timeEntries, setTimeEntries] = useState({
    mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: ''
  });

  const timeLogs = timeLogsData?.data || [];

  const weekStart = new Date(selectedWeek);
  weekStart.setDate(selectedWeek.getDate() - selectedWeek.getDay());

  const handleLogDay = (day: string, value: string) => {
    setTimeEntries({ ...timeEntries, [day]: value });
  };

  const handleSubmitWeek = () => {
    const totalHours = Object.values(timeEntries).reduce((sum, h) => sum + (parseFloat(h) || 0), 0);
    if (totalHours > 0) {
      logTime({
        hours_logged: totalHours,
        log_date: new Date().toISOString().split('T')[0],
      });
      setTimeEntries({ mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' });
    }
  };

  const weeklyTotal = Object.values(timeEntries).reduce((sum, h) => sum + (parseFloat(h) || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timesheet</h1>
          <p className="text-gray-600 mt-1">Log and track your weekly hours</p>
        </div>

        {/* Week Navigation */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setSelectedWeek(new Date(selectedWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Previous Week
            </button>
            <div className="text-center">
              <p className="font-semibold text-gray-900">
                Week of {weekStart.toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                {weekStart.toLocaleDateString()} - {new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => setSelectedWeek(new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Next Week →
            </button>
          </div>
        </div>

        {/* Weekly Timesheet Grid */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Weekly Hours</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const dayKey = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][idx];
                const date = new Date(weekStart);
                date.setDate(weekStart.getDate() + idx);

                return (
                  <div key={day} className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      {day}
                      <div className="text-xs text-gray-500">{date.toLocaleDateString()}</div>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={timeEntries[dayKey as keyof typeof timeEntries]}
                      onChange={(e) => handleLogDay(dayKey, e.target.value)}
                      placeholder="Hours"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-center"
                    />
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg mb-6">
              <span className="font-semibold text-gray-900">Weekly Total</span>
              <span className="text-2xl font-bold text-teal-500">{weeklyTotal.toFixed(1)} hours</span>
            </div>

            {/* Status Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-bold text-green-600">✓ Submitted</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-600">Approval</p>
                <p className="text-lg font-bold text-yellow-600">Pending</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                <p className="text-sm text-gray-600">Sync Status</p>
                <p className="text-lg font-bold text-teal-500">✓ Synced</p>
              </div>
            </div>

            <button
              onClick={handleSubmitWeek}
              disabled={weeklyTotal === 0}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              Submit Timesheet
            </button>
          </div>
        </div>

        {/* Time Entry History */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Time Entry History</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hours</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Task</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {timeLogs.length > 0 ? (
                  timeLogs.slice(0, 10).map((log: any) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(log.log_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {log.hours_logged}h
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        Task #{log.task_id}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Approved
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No time entries yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
