import { useState, useEffect } from 'react';

const OrdersTab = ({ orders, products }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    // No additional API call needed since orders and products are passed as props
    setLoading(false);
  }, [orders, products]);

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
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => {
            const totalPrice = order.cart.items.reduce((acc, item) => {
              const product = products.find((p) => p._id === item.productId);
              return acc + (product ? product.price * item.quantity : 0);
            }, 0);

            return (
              <div
                key={order._id}
                className="card bg-base-100 shadow-xl border"
              >
                <div className="card-body">
                  <h3 className="card-title">Order #{order._id}</h3>
                  <p className="text-gray-600">
                    <span className="font-medium">Status:</span>{' '}
                    <span
                      className={`badge ${
                        order.status === 'completed'
                          ? 'badge-success'
                          : 'badge-error'
                      }`}
                    >
                      {order.status === 'completed' ? 'Paid' : 'Failed'}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Total:</span> ₹
                    {totalPrice.toFixed(2)}
                  </p>
                  <div className="mt-2">
                    <h4 className="font-medium">Items:</h4>
                    <ul className="list-disc pl-5">
                      {order.cart.items.map((item, index) => {
                        const product = products.find(
                          (p) => p._id === item.productId
                        );
                        return (
                          <li key={index} className="text-gray-600">
                            {product ? product.name : 'Unknown Product'} x{' '}
                            {item.quantity} @ ₹{product ? product.price : 'N/A'}{' '}
                            each
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
