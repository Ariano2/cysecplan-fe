import { useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from '../utils/constants';
import ToAdmin from './navigators/ToAdmin';

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [viewArticle, setViewArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageLimit = 10;

  const fetchArticles = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${base_url}/api/articles?page=${page}&limit=${pageLimit}`,
        { withCredentials: true }
      );
      setArticles(response.data.articles || []);
      setTotalPages(response.data.pages || 1);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch articles.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  const openArticleModal = (article = null) => {
    setSelectedArticle(article);
    setFormData(
      article
        ? {
            title: article.title,
            description: article.description,
            content: article.content,
          }
        : { title: '', description: '', content: '' }
    );
    setToast({ show: false, message: '', type: '' });
    document.getElementById('article_modal').showModal();
  };

  const openViewModal = (article) => {
    setViewArticle(article);
    document.getElementById('view_article_modal').showModal();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.title || formData.title.length < 3) {
      setToast({
        show: true,
        message: 'Title must be at least 3 characters.',
        type: 'error',
      });
      return false;
    }
    if (!formData.description || formData.description.length < 10) {
      setToast({
        show: true,
        message: 'Description must be at least 10 characters.',
        type: 'error',
      });
      return false;
    }
    if (!formData.content || formData.content.length < 50) {
      setToast({
        show: true,
        message: 'Content must be at least 50 characters.',
        type: 'error',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
      return;
    }

    try {
      if (selectedArticle) {
        // Update article
        const response = await axios.put(
          `${base_url}/api/articles/${selectedArticle._id}`,
          formData,
          { withCredentials: true }
        );
        setArticles((prev) =>
          prev.map((a) => (a._id === selectedArticle._id ? response.data : a))
        );
        setToast({
          show: true,
          message: 'Article updated successfully!',
          type: 'success',
        });
      } else {
        // Create article
        const response = await axios.post(
          `${base_url}/api/articles`,
          formData,
          { withCredentials: true }
        );
        setArticles((prev) => [response.data, ...prev]);
        setToast({
          show: true,
          message: 'Article created successfully!',
          type: 'success',
        });
      }
      document.getElementById('article_modal').close();
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data || 'Failed to save article.',
        type: 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    }
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?'))
      return;
    try {
      await axios.delete(`${base_url}/api/articles/${articleId}`, {
        withCredentials: true,
      });
      setArticles((prev) => prev.filter((a) => a._id !== articleId));
      setToast({
        show: true,
        message: 'Article deleted successfully!',
        type: 'success',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data || 'Failed to delete article.',
        type: 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <ToAdmin />
      <h1 className="text-2xl font-bold mb-4">Manage Articles</h1>
      <button
        className="btn btn-primary mb-4"
        onClick={() => openArticleModal()}
      >
        Create New Article
      </button>

      {/* Article List */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Author</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500">
                  No articles found.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article._id}>
                  <td>{article.title}</td>
                  <td>{article.description.slice(0, 50)}...</td>
                  <td>{article.author?.firstName || 'Unknown'}</td>{' '}
                  {/* Corrected author display here */}
                  <td>{new Date(article.createdAt).toLocaleDateString()}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-info btn-sm mb-2 mr-2"
                      onClick={() => openViewModal(article)}
                    >
                      Read
                    </button>
                    <button
                      className="btn btn-outline btn-sm mb-2 mr-2"
                      onClick={() => openArticleModal(article)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDelete(article._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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

      {/* Create/Edit Article Modal */}
      <dialog id="article_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">
            {selectedArticle ? 'Edit Article' : 'Create Article'}
          </h3>
          <div className="py-4">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              className="input input-bordered w-full"
              placeholder="Enter article title"
            />
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              className="textarea textarea-bordered w-full"
              placeholder="Enter article description"
            />
            <label className="label">
              <span className="label-text">Content</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleFormChange}
              className="textarea textarea-bordered w-full h-64"
              placeholder="Enter article content"
            />
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleSubmit}>
              {selectedArticle ? 'Update' : 'Create'}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => document.getElementById('article_modal').close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      {/* View Article Modal */}
      <dialog id="view_article_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          {viewArticle && (
            <>
              <h3 className="font-bold text-lg">{viewArticle.title}</h3>
              <p className="text-gray-600 mt-2">
                <span className="font-medium">Author:</span>{' '}
                {viewArticle.author?.firstName || 'Unknown'}{' '}
                {/* Corrected author access */}
                {viewArticle.author?.lastName
                  ? ` ${viewArticle.author.lastName}`
                  : ''}{' '}
                {/* Optional: Add last name */}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Created:</span>{' '}
                {new Date(viewArticle.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Likes:</span>{' '}
                {viewArticle.activity?.total_likes || 0}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Reads:</span>{' '}
                {viewArticle.activity?.total_reads || 0}
              </p>
              <div className="mt-4">
                <h4 className="font-medium">Description:</h4>
                <p className="text-gray-600">{viewArticle.description}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-medium">Content:</h4>
                {/* Assuming content might have HTML, consider using dangerouslySetInnerHTML */}
                <div
                  className="prose text-gray-600"
                  dangerouslySetInnerHTML={{ __html: viewArticle.content }}
                ></div>
              </div>
              <div className="modal-action">
                <button
                  className="btn btn-outline"
                  onClick={() =>
                    document.getElementById('view_article_modal').close()
                  }
                >
                  Close
                </button>
              </div>
            </>
          )}
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

export default ManageArticles;
