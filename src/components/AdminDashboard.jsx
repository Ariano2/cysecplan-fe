import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { base_url, dtFormat } from '../utils/constants';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({
    articleCount: 0,
    totalReads: 0,
    totalProducts: 0,
    pendingRequests: 0,
    upcomingWorkshops: [],
    minimalProducts: [],
    minimalArticles: [],
    pagination: {
      productPage: 1,
      productLimit: 5,
      productTotalPages: 1,
      articlePage: 1,
      articleLimit: 5,
      articleTotalPages: 1,
      workshopPage: 1,
      workshopLimit: 5,
      workshopTotalPages: 1,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for pagination
  const [currentPages, setCurrentPages] = useState({
    workshopPage: 1,
    productPage: 1,
    articlePage: 1,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(
          `${base_url}/api/admin/analytics?page=${currentPages.workshopPage}&productPage=${currentPages.productPage}&articlePage=${currentPages.articlePage}`,
          { withCredentials: true }
        );
        setAnalytics(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [currentPages]);

  const handlePageChange = (section, newPage) => {
    setCurrentPages((prev) => ({
      ...prev,
      [section]: newPage,
    }));
    setLoading(true); // Set loading to true when changing pages
  };

  const renderPagination = (section, currentPage, totalPages) => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center mt-4">
        <div className="join">
          {[...Array(totalPages).keys()].map((_, index) => (
            <button
              key={index + 1}
              className={`join-item btn ${
                currentPage === index + 1 ? 'btn-active' : ''
              }`}
              onClick={() => handlePageChange(section, index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <span className="ml-2 text-base-content">Loading Dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg m-4">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="drawer md:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-6">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button my-4 md:hidden"
        >
          Open Admin Drawer
        </label>

        <h1 className="text-3xl font-bold text-base-content mb-6">
          Admin Dashboard
        </h1>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              title: 'Upcoming Workshops',
              value: analytics.upcomingWorkshops.length,
            },
            {
              title: 'Pending Requests',
              value: analytics.pendingRequests,
            },
            {
              title: 'Total Products',
              value: analytics.totalProducts,
            },
            {
              title: 'Articles & Reads',
              value: `${analytics.articleCount} / ${analytics.totalReads}`,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="card bg-gradient-to-br from-primary to-secondary text-white shadow-xl"
            >
              <div className="card-body">
                <h2 className="card-title">{item.title}</h2>
                <p className="text-3xl font-bold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Workshops */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Upcoming Workshops</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.upcomingWorkshops.length === 0 ? (
              <div className="col-span-full alert alert-info">
                No upcoming workshops
              </div>
            ) : (
              analytics.upcomingWorkshops.map((w) => (
                <div key={w._id} className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="font-bold text-lg">{w.title}</h3>
                    <p className="text-sm">
                      <strong>Start:</strong>{' '}
                      {dtFormat.format(new Date(w.startDate))}
                      <br />
                      <strong>Register by:</strong>{' '}
                      {dtFormat.format(new Date(w.registrationDeadline))}
                      <br />
                      <strong>Pending Requests:</strong> {w.pendingRequests}
                    </p>
                    <Link
                      to={`/workshop/edit/${w._id}`}
                      className="btn btn-sm btn-primary mt-2"
                    >
                      Edit Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          {renderPagination(
            'workshopPage',
            analytics.pagination.workshopPage,
            analytics.pagination.workshopTotalPages
          )}
        </div>

        {/* Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.minimalProducts.length === 0 ? (
              <div className="col-span-full alert alert-info">
                No products available
              </div>
            ) : (
              analytics.minimalProducts.map((p) => (
                <div key={p._id} className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="font-bold text-lg">{p.name}</h3>
                    <p className="text-sm">
                      <strong>Price:</strong> ₹{p.price.toLocaleString()}
                      <br />
                      <strong>Stock:</strong> {p.stock}
                    </p>
                    <Link
                      to={'/manage/products/'}
                      className="btn btn-sm btn-secondary mt-2"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          {renderPagination(
            'productPage',
            analytics.pagination.productPage,
            analytics.pagination.productTotalPages
          )}
        </div>

        {/* Articles */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.minimalArticles.length === 0 ? (
              <div className="col-span-full alert alert-info">
                No articles available
              </div>
            ) : (
              analytics.minimalArticles.map((a) => (
                <div key={a._id} className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="font-bold text-lg">{a.title}</h3>
                    <p className="text-sm text-gray-500">{a.description}</p>
                    <Link
                      to={'/manage/articles'}
                      className="btn btn-sm btn-accent mt-2"
                    >
                      View Article
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          {renderPagination(
            'articlePage',
            analytics.pagination.articlePage,
            analytics.pagination.articleTotalPages
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {[
            {
              text: 'Create New Workshop',
              to: '/create/workshop',
            },
            {
              text: 'Manage Join Requests',
              to: '/manage/workshops',
            },
            {
              text: 'Manage Products',
              to: '/manage/products',
            },
            {
              text: 'Manage Articles',
              to: '/manage/articles',
            },
          ].map((item, i) => (
            <li key={i}>
              <Link
                className="bg-base-300 p-4 mt-2 hover:bg-secondary rounded-lg"
                to={item.to}
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
