import React, { useState } from 'react';
import { useTask, useTaskComments, useCreateComment, useLogTime } from '../api';
import { useAppStore } from '../stores/app';

interface TaskDetailModalProps {
  taskId: number;
}

export default function TaskDetailModal({ taskId }: TaskDetailModalProps) {
  const { data: task, isLoading } = useTask(taskId);
  const { data: comments } = useTaskComments(taskId);
  const { mutate: addComment, isLoading: isCommentLoading } = useCreateComment(taskId);
  const { mutate: logTime } = useLogTime(taskId);

  const { modals, closeModal } = useAppStore();
  const [commentText, setCommentText] = useState('');
  const [timeHours, setTimeHours] = useState('');

  if (!modals.taskDetail) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment({ content: commentText }, {
        onSuccess: () => setCommentText(''),
      });
    }
  };

  const handleLogTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (timeHours) {
      logTime(
        {
          hours_logged: parseFloat(timeHours),
          log_date: new Date().toISOString().split('T')[0],
        },
        {
          onSuccess: () => setTimeHours(''),
        },
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">Loading task...</p>
          </div>
        ) : task ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-start sticky top-0 bg-white">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
                <p className="text-sm text-gray-500 mt-1">ID: {task.id}</p>
              </div>
              <button
                onClick={() => closeModal('taskDetail')}
                className="text-gray-500 hover:text-gray-700 font-bold text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {task.description || 'No description provided'}
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Type</p>
                  <p className="font-medium text-gray-900 capitalize">{task.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Priority</p>
                  <p className={`font-medium capitalize ${
                    task.priority === 'critical' ? 'text-red-600' :
                    task.priority === 'high' ? 'text-orange-600' :
                    'text-gray-900'
                  }`}>
                    {task.priority}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <p className="font-medium text-gray-900 capitalize">{task.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Estimate</p>
                  <p className="font-medium text-gray-900">
                    {task.estimate_hours ? `${task.estimate_hours}h` : 'Not estimated'}
                  </p>
                </div>
              </div>

              {/* Log Time */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Log Time</h3>
                <form onSubmit={handleLogTime} className="flex gap-2">
                  <input
                    type="number"
                    step="0.5"
                    value={timeHours}
                    onChange={(e) => setTimeHours(e.target.value)}
                    placeholder="Hours"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!timeHours}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Log
                  </button>
                </form>
              </div>

              {/* Comments */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Comments ({comments?.length || 0})</h3>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="mb-4">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={2}
                  />
                  <button
                    type="submit"
                    disabled={isCommentLoading || !commentText.trim()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                  >
                    {isCommentLoading ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                        <p className="font-medium text-gray-900">User {comment.user_id}</p>
                        <p className="text-gray-700 mt-1">{comment.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No comments yet</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500">Task not found</p>
          </div>
        )}
      </div>
    </div>
  );
}
