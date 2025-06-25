import { useState } from 'react';
import axios from 'axios';
import { base_url } from '../utils/constants';

const StoreTab = ({ products, setProducts, onCartUpdate }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const handleQuantityChange = (e, stock) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      const numValue = value === '' ? '' : parseInt(value, 10);
      if (numValue === '' || (numValue >= 1 && numValue <= stock)) {
        setQuantity(numValue);
      }
    }
  };

  const openQuantityModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setToast({ show: false, message: '', type: '' });
    document.getElementById('quantity_modal').showModal();
  };

  const addToCart = async () => {
    setToast({ show: false, message: '', type: '' });
    if (!quantity || quantity < 1) {
      setToast({
        show: true,
        message: 'Please enter a quantity of at least 1.',
        type: 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
      return;
    }
    if (quantity > selectedProduct.stock) {
      setToast({
        show: true,
        message: `Cannot add ${quantity}. Only ${selectedProduct.stock} available.`,
        type: 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
      return;
    }
    try {
      const response = await axios.post(
        `${base_url}/api/cart/addItem`,
        {
          productId: selectedProduct._id,
          quantity,
        },
        { withCredentials: true }
      );
      if (response.status === 201 || response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p._id === selectedProduct._id
              ? { ...p, stock: p.stock - quantity }
              : p
          )
        );
        setToast({
          show: true,
          message: `${quantity} ${selectedProduct.name}(s) added to cart!`,
          type: 'success',
        });
        onCartUpdate(); // Trigger cart count refresh
        document.getElementById('quantity_modal').close();
        setTimeout(
          () => setToast({ show: false, message: '', type: '' }),
          3000
        );
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (err) {
      console.error('API Error:', err.response || err);
      setToast({
        show: true,
        message: err.response?.data || err.message || 'Failed to add to cart.',
        type: 'error',
      });
      document.getElementById('quantity_modal').close();
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Store</h2>
      {products.length === 0 ? (
        <p className="text-gray-500">No products available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product._id} className="card bg-base-100 shadow-sm">
              <figure>
                {product.imageUrl ? (
                  <img
                    src={`${base_url}${product.imageUrl}`}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-neutral text-neutral-content flex items-center justify-center">
                    No Image
                  </div>
                )}
              </figure>
              <div className="card-body">
                <h2 className="card-title">{product.name}</h2>
                <p className="text-sm text-neutral-content">
                  <span className="font-semibold">Category:</span>{' '}
                  {product.category}
                </p>
                <p className="text-sm text-neutral-content">
                  <span className="font-semibold">Price:</span> ₹{' '}
                  {product.price}
                </p>
                <p className="text-sm text-neutral-content">
                  <span className="font-semibold">Stock:</span>{' '}
                  {product.stock > 0
                    ? `${product.stock} available`
                    : 'Out of stock'}
                </p>
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-primary w-full"
                    disabled={product.stock === 0}
                    onClick={() => openQuantityModal(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quantity Modal */}
      <dialog id="quantity_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Select Quantity</h3>
          {selectedProduct && (
            <>
              <p className="py-2">
                How many {selectedProduct.name}(s) do you want to add to your
                cart? (Up to {selectedProduct.stock} available)
              </p>
              <input
                type="number"
                min="1"
                max={selectedProduct.stock}
                value={quantity}
                onChange={(e) => handleQuantityChange(e, selectedProduct.stock)}
                className="input input-bordered w-full mb-4"
              />
            </>
          )}
          <div className="modal-action">
            <button className="btn btn-primary" onClick={addToCart}>
              Add to Cart
            </button>
            <button
              className="btn btn-outline"
              onClick={() => document.getElementById('quantity_modal').close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      {/* Toast Notification */}
      {toast.show && (
        <div className="toast toast-end z-50">
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

export default StoreTab;
