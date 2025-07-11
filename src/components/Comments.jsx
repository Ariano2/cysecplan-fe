import { useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from '../utils/constants';

const Comments = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageLimit = 10;

  const fetchComments = async (page = 1) => {
    try {
      const response = await axios.get(
        `${base_url}/api/articles/${articleId}/comments?page=${page}&limit=${pageLimit}`
      );
      setComments(response.data.comments || []);
      setTotalPages(response.data.pages || 1);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data || 'Failed to fetch comments.',
        type: 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    }
  };

  useEffect(() => {
    fetchComments(currentPage);
  }, [articleId, currentPage]);

  const handlePostComment = async () => {
    if (!newComment.trim()) {
      setToast({
        show: true,
        message: 'Comment cannot be empty.',
        type: 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
      return;
    }

    try {
      const response = await axios.post(
        `${base_url}/api/articles/${articleId}/comments`,
        { content: newComment },
        { withCredentials: true }
      );
      setComments((prev) => [response.data, ...prev]);
      setNewComment('');
      setToast({
        show: true,
        message: 'Comment posted successfully!',
        type: 'success',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data || 'Failed to post comment.',
        type: 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      {/* Post Comment Form */}
      <div className="mb-6">
        <textarea
          className="textarea textarea-bordered w-full mb-2"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={handlePostComment}
          disabled={!newComment.trim()}
        >
          Post Comment
        </button>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="card bg-base-100 shadow-sm p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-600">
                  <span className="font-medium">
                    {comment.author?.firstName || 'Unknown'}
                  </span>{' '}
                  • {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-secondary-content">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="btn-group">
            <button
              className="btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              «
            </button>
            <button className="btn">Page {currentPage}</button>
            <button
              className="btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="toast toast-end">
          <div
            className={`alert ${
              toast.type === 'success' ? 'alert-success' : 'alert-error'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
