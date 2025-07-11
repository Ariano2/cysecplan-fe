import { useState, useEffect } from 'react';
import { base_url } from '../utils/constants';
import axios from 'axios';
import { useNavigate } from 'react-router';
import WorkshopsTab from '../components/WorkshopsTab';
import StoreTab from '../components/StoreTab';
import ArticlesTab from '../components/ArticlesTab';
import OrdersTab from '../components/OrdersTab';
import JoinRequestsTab from '../components/JoinRequestsTab';

const ParticipantDashboard = () => {
  const [activeTab, setActiveTab] = useState('workshops');
  const [workshops, setWorkshops] = useState([]);
  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const navigationHandlers = {
    joinWorkshop: (workshopId) => navigate(`/join/workshop/${workshopId}`),
    toArticle: (articleId) => navigate(`/article/${articleId}`),
    toCart: () => navigate('/cart'),
  };

  const fetchCartCount = async () => {
    try {
      const cartResponse = await axios.get(`${base_url}/api/cart`, {
        withCredentials: true,
      });
      const count =
        cartResponse.data?.items?.reduce(
          (acc, item) => acc + item.quantity,
          0
        ) || 0;
      setCartCount(count);
    } catch (err) {
      console.error('Failed to fetch cart count:', err.response || err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [
          workshopsResponse,
          productsResponse,
          articlesResponse,
          cartResponse,
          ordersResponse,
          joinRequestsResponse,
        ] = await Promise.all([
          axios.get(`${base_url}/api/workshop/available`, {
            withCredentials: true,
          }),
          axios.get(`${base_url}/api/product/viewAll`, {
            withCredentials: true,
          }),
          axios.get(`${base_url}/api/articles`, { withCredentials: true }),
          axios.get(`${base_url}/api/cart`, { withCredentials: true }),
          axios.get(`${base_url}/api/orders`, { withCredentials: true }),
          axios.get(`${base_url}/api/workshop/join/request`, {
            withCredentials: true,
          }),
        ]);

        setWorkshops(workshopsResponse.data[0]?.data || []);
        setProducts(productsResponse.data || []);
        setArticles(articlesResponse.data?.articles || []);
        setOrders(ordersResponse.data || []);
        setJoinRequests(joinRequestsResponse.data?.requestStatus || []);
        const count =
          cartResponse.data?.items?.reduce(
            (acc, item) => acc + item.quantity,
            0
          ) || 0;
        setCartCount(count);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error !== '') {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Participant Dashboard</h1>

      {/* Tabs */}
      <div className="flex justify-between items-center border-b mb-4">
        <div>
          <button
            className={`px-4 py-2 ${
              activeTab === 'workshops'
                ? 'border-b-2 border-blue-500 font-semibold'
                : ''
            }`}
            onClick={() => setActiveTab('workshops')}
          >
            Workshops
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 'store'
                ? 'border-b-2 border-blue-500 font-semibold'
                : ''
            }`}
            onClick={() => setActiveTab('store')}
          >
            Store
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 'articles'
                ? 'border-b-2 border-blue-500 font-semibold'
                : ''
            }`}
            onClick={() => setActiveTab('articles')}
          >
            Articles
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 'orders'
                ? 'border-b-2 border-blue-500 font-semibold'
                : ''
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 'joinRequest'
                ? 'border-b-2 border-blue-500 font-semibold'
                : ''
            }`}
            onClick={() => setActiveTab('joinRequest')}
          >
            Workshop Requests
          </button>
        </div>
        <div>
          <button
            className="btn btn-ghost relative"
            onClick={navigationHandlers.toCart}
          >
            🛒
            {cartCount > 0 && (
              <span className="badge badge-primary badge-sm absolute -top-2 -right-2">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'workshops' && (
        <WorkshopsTab
          workshops={workshops}
          joinWorkshop={navigationHandlers.joinWorkshop}
        />
      )}
      {activeTab === 'store' && (
        <StoreTab
          products={products}
          setProducts={setProducts}
          onCartUpdate={fetchCartCount}
        />
      )}
      {activeTab === 'articles' && (
        <ArticlesTab
          articles={articles}
          toArticle={navigationHandlers.toArticle}
        />
      )}
      {activeTab === 'orders' && (
        <OrdersTab orders={orders} products={products} />
      )}
      {activeTab === 'joinRequest' && (
        <JoinRequestsTab joinRequests={joinRequests} />
      )}
    </div>
  );
};

export default ParticipantDashboard;
