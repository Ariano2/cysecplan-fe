import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { base_url } from '../utils/constants';

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const cartResponse = await axios.get(`${base_url}/api/cart`, {
          withCredentials: true,
        });
        setCart(cartResponse.data || { items: [] });

        // Fetch product details for cart items
        const productIds = cartResponse.data.items.map(
          (item) => item.productId
        );
        if (productIds.length > 0) {
          const productsResponse = await axios.get(
            `${base_url}/api/product/viewAll`,
            { withCredentials: true }
          );
          setProducts(
            productsResponse.data.filter((p) => productIds.includes(p._id))
          );
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data || 'Failed to load cart.');
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const product = products.find((p) => p._id === productId);
      if (newQuantity > product.stock) {
        setToast({
          show: true,
          message: `Cannot add more. Only ${product.stock} available.`,
          type: 'error',
        });
        setTimeout(
          () => setToast({ show: false, message: '', type: '' }),
          3000
        );
        return;
      }
      await axios.post(
        `${base_url}/api/cart/addItem`,
        {
          productId,
          quantity:
            newQuantity -
            cart.items.find((i) => i.productId === productId).quantity,
        },
        { withCredentials: true }
      );
      setCart((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        ),
      }));
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? {
                ...p,
                stock:
                  p.stock -
                  (newQuantity -
                    cart.items.find((i) => i.productId === productId).quantity),
              }
            : p
        )
      );
      setToast({
        show: true,
        message: 'Quantity updated!',
        type: 'success',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data || 'Failed to update quantity.',
        type: 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.post(
        `${base_url}/api/cart/removeItem`,
        { productId },
        { withCredentials: true }
      );
      const removedItem = cart.items.find((i) => i.productId === productId);
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.productId !== productId),
      }));
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? { ...p, stock: p.stock + removedItem.quantity }
            : p
        )
      );
      setToast({
        show: true,
        message: 'Item removed from cart!',
        type: 'success',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data || 'Failed to remove item.',
        type: 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    }
  };

  const createOrderAndPay = async () => {
    try {
      // Create order
      const orderResponse = await axios.post(
        `${base_url}/api/cart/order`,
        {},
        { withCredentials: true }
      );
      const orderId = orderResponse.data._id;

      // Simulate payment
      const paymentResponse = await axios.post(
        `${base_url}/api/cart/pay`,
        { orderId },
        { withCredentials: true }
      );

      setCart({ items: [] }); // Clear cart locally
      setToast({
        show: true,
        message: paymentResponse.data.message,
        type:
          paymentResponse.data.paymentStatus === 'success'
            ? 'success'
            : 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data || 'Failed to process order or payment.',
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

  const totalPrice = cart.items.reduce((acc, item) => {
    const product = products.find((p) => p._id === item.productId);
    return acc + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <button
        className="btn btn-outline mb-4"
        onClick={() => navigate('/participant')}
      >
        Back to Dashboard
      </button>
      {cart.items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid gap-4">
          {cart.items.map((item) => {
            const product = products.find((p) => p._id === item.productId);
            return (
              <div
                key={item.productId}
                className="border rounded-lg p-4 shadow-md bg-base-100"
              >
                <h3 className="text-lg font-semibold">
                  {product ? product.name : 'Unknown Product'}
                </h3>
                <p className="text-gray-600">
                  <span className="font-medium">Price:</span> ₹
                  {product ? product.price : 'N/A'}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Stock:</span>{' '}
                  {product && product.stock > 0
                    ? `${product.stock} available`
                    : 'Out of stock'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-medium">Quantity:</span>
                  <input
                    type="number"
                    min="1"
                    max={product ? product.stock : 1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        item.productId,
                        parseInt(e.target.value, 10)
                      )
                    }
                    className="input input-bordered w-20"
                  />
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
          <div className="mt-4">
            <h2 className="text-xl font-semibold">
              Total: ₹{totalPrice.toFixed(2)}
            </h2>
            <button
              className="btn btn-primary mt-2"
              onClick={createOrderAndPay}
              disabled={cart.items.length === 0}
            >
              Proceed to Payment
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

export default Cart;
