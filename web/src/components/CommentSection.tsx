import React, { useState } from 'react';
import { useTaskComments, useCreateComment } from '../api';
import { useAppStore } from '../stores/app';

interface CommentSectionProps {
  taskId: number;
}

export default function CommentSection({ taskId }: CommentSectionProps) {
  const { data: comments, isLoading } = useTaskComments(taskId);
  const { mutate: createComment, isLoading: isCreating } = useCreateComment(taskId);
  const [commentText, setCommentText] = useState('');
  const { addToast } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      addToast('Comment cannot be empty', 'error');
      return;
    }

    createComment(
      { body: commentText },
      {
        onSuccess: () => {
          setCommentText('');
          addToast('Comment added successfully', 'success');
        },
        onError: (error: any) => {
          addToast(error.response?.data?.error?.message || 'Failed to add comment', 'error');
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          rows={3}
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={isCreating || !commentText.trim()}
            className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Comments ({comments?.length || 0})</h3>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment: any) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{comment.author?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}
