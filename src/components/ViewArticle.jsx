import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { base_url } from '../utils/constants';
import Comments from './Comments';

const ViewArticle = () => {
  const { id: articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [likeStatus, setLikeStatus] = useState('');
  const [hasLiked, setHasLiked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const fetchArticleDetails = async () => {
    try {
      const response = await axios.get(
        `${base_url}/api/articles/${articleId}`,
        {
          withCredentials: true,
        }
      );

      const articleData = response.data;
      console.log('Article data:', articleData); // Debug log to verify isLiked
      setArticle(articleData);
      setHasLiked(articleData.isLiked || false); // Set based on backend's isLiked
      setIsAuthenticated(
        !!articleData.isLiked || articleData.isLiked === false
      ); // If isLiked is present, user is likely authenticated
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message); // Debug log
      if (err.response?.status === 401) {
        setError('Please log in to view article details.');
        setIsAuthenticated(false);
      } else {
        setError(err.response?.data || 'Failed to load article.');
      }
      setHasLiked(false);
      setLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!isAuthenticated || !article) {
      setLikeStatus('Please log in to like/unlike articles.');
      return;
    }

    try {
      const response = await axios.post(
        `${base_url}/api/articles/${articleId}/like`,
        {},
        { withCredentials: true }
      );

      console.log('Like response:', response.data); // Debug log
      setArticle((prev) => ({
        ...prev,
        activity: {
          ...prev.activity,
          total_likes: response.data.total_likes,
        },
      }));

      setHasLiked(response.data.isLiked);
      setLikeStatus(response.data.message);
    } catch (err) {
      console.error('Like error:', err.response?.data || err.message); // Debug log
      setLikeStatus(
        err.response?.status === 401
          ? 'Please log in to like/unlike articles.'
          : err.response?.data || 'Action failed.'
      );
    }
  };

  useEffect(() => {
    if (articleId) {
      fetchArticleDetails();
    }
  }, [articleId]);

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

  if (!article) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No article found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <button
        className="btn btn-outline mb-4"
        onClick={() => navigate('/participant')}
      >
        Back to Dashboard
      </button>
      <div className="card bg-base-200 shadow-sm mx-auto my-10 max-w-3xl">
        <p className="text-gray-600 m-2">
          <span className="font-medium">Likes:</span>{' '}
          {article.activity?.total_likes || 0}
        </p>
        <p className="text-gray-600 m-2">
          <span className="font-medium">Reads:</span>{' '}
          {article.activity?.total_reads || 0}
        </p>
        <div className="card-body">
          <h1 className="card-title text-2xl font-bold mb-4">
            {article.title}
          </h1>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Author:</span>{' '}
            {article.author?.firstName || 'Unknown'}
          </p>
          {article.description && (
            <p className="text-gray-600 mb-4">
              <span className="font-medium">Description:</span>{' '}
              {article.description}
            </p>
          )}
          <div className="prose max-w-none mb-4">
            <p>{article.content}</p>
          </div>
          <button
            className={`btn w-full max-w-xs ${
              hasLiked
                ? 'btn-error text-error-content'
                : 'btn-primary text-primary-content'
            } ${!isAuthenticated ? 'btn-disabled' : ''}`}
            onClick={handleLikeToggle}
            disabled={!isAuthenticated}
          >
            {hasLiked ? 'Unlike 👎' : 'Like ❤️'}
          </button>
          {likeStatus && (
            <p
              className={`mt-2 text-sm ${
                likeStatus.includes('liked')
                  ? 'text-primary-content'
                  : likeStatus.includes('unliked')
                  ? 'text-yellow-500'
                  : 'text-error-content'
              }`}
            >
              {likeStatus}
            </p>
          )}
        </div>
      </div>
      <Comments articleId={articleId} />
    </div>
  );
};

export default ViewArticle;
