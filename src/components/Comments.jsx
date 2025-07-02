import { useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from '../utils/constants';

const Comments = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
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

  const openEditModal = (comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
    document.getElementById('edit_comment_modal').showModal();
  };

  const handleEditComment = async () => {
    if (!editContent.trim()) {
      setToast({
        show: true,
        message: 'Comment cannot be empty.',
        type: 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
      return;
    }

    try {
      const response = await axios.put(
        `${base_url}/api/comments/${editingComment._id}`,
        { content: editContent },
        { withCredentials: true }
      );
      setComments((prev) =>
        prev.map((c) => (c._id === editingComment._id ? response.data : c))
      );
      setEditingComment(null);
      setEditContent('');
      document.getElementById('edit_comment_modal').close();
      setToast({
        show: true,
        message: 'Comment updated successfully!',
        type: 'success',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data || 'Failed to update comment.',
        type: 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?'))
      return;

    try {
      await axios.delete(`${base_url}/api/comments/${commentId}`, {
        withCredentials: true,
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setToast({
        show: true,
        message: 'Comment deleted successfully!',
        type: 'success',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data || 'Failed to delete comment.',
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
                {comment.author?._id && (
                  <div>
                    <button
                      className="btn btn-outline btn-sm mr-2"
                      onClick={() => openEditModal(comment)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-800">{comment.content}</p>
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

      {/* Edit Comment Modal */}
      <dialog id="edit_comment_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Comment</h3>
          <div className="py-4">
            <textarea
              className="textarea textarea-bordered w-full"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          </div>
          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={handleEditComment}
              disabled={!editContent.trim()}
            >
              Update
            </button>
            <button
              className="btn btn-outline"
              onClick={() =>
                document.getElementById('edit_comment_modal').close()
              }
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>

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
