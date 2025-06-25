import { useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from '../utils/constants';
import ToAdmin from './navigators/ToAdmin';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'insurance',
  });
  const [imageFile, setImageFile] = useState(null); // State for image file
  const [imagePreview, setImagePreview] = useState(''); // State for image preview
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageLimit = 10;
  const validCategories = ['insurance', 'book', 'course'];
  const maxImageSize = 5 * 1024 * 1024; // 5MB
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${base_url}/api/product/viewAll?page=${page}&pageLimit=${pageLimit}`,
        { withCredentials: true }
      );
      setProducts(response.data || []);
      const totalProducts =
        response.data.length === pageLimit
          ? page * pageLimit
          : response.data.length;
      setTotalPages(Math.ceil(totalProducts / pageLimit) || 1);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch products.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const openProductModal = (product = null) => {
    setSelectedProduct(product);
    setFormData(
      product
        ? {
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category,
          }
        : { name: '', price: '', stock: '', category: 'insurance' }
    );
    // Set image preview for editing or clear for new product
    setImagePreview(product?.imageUrl ? `${base_url}${product.imageUrl}` : '');
    setImageFile(null);
    setToast({ show: false, message: '', type: '' });
    document.getElementById('product_modal').showModal();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image type
      if (!validImageTypes.includes(file.type)) {
        setToast({
          show: true,
          message: 'Invalid image type. Use JPEG, PNG, or GIF.',
          type: 'error',
        });
        setTimeout(
          () => setToast({ show: false, message: '', type: '' }),
          3000
        );
        return;
      }
      // Validate image size
      if (file.size > maxImageSize) {
        setToast({
          show: true,
          message: 'Image size must be less than 5MB.',
          type: 'error',
        });
        setTimeout(
          () => setToast({ show: false, message: '', type: '' }),
          3000
        );
        return;
      }
      setImageFile(file);
      // Create a preview URL
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (
      formData.name &&
      (formData.name.length < 3 || formData.name.length > 100)
    ) {
      setToast({
        show: true,
        message: 'Name must be between 3 and 100 characters.',
        type: 'error',
      });
      return false;
    }
    if (formData.price && (formData.price < 1 || formData.price > 10000000)) {
      setToast({
        show: true,
        message: 'Price must be between 1 and 10,000,000.',
        type: 'error',
      });
      return false;
    }
    if (formData.stock && (formData.stock < 0 || formData.stock > 100000)) {
      setToast({
        show: true,
        message: 'Stock must be between 0 and 100,000.',
        type: 'error',
      });
      return false;
    }
    if (formData.category && !validCategories.includes(formData.category)) {
      setToast({ show: true, message: 'Invalid category.', type: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', parseFloat(formData.price));
    data.append('stock', parseInt(formData.stock, 10) || 0);
    data.append('category', formData.category);
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (selectedProduct) {
        // Edit product
        const response = await axios.patch(
          `${base_url}/api/product/edit/${selectedProduct._id}`,
          data,
          {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        setProducts((prev) =>
          prev.map((p) => (p._id === selectedProduct._id ? response.data : p))
        );
        setToast({
          show: true,
          message: 'Product updated successfully!',
          type: 'success',
        });
      } else {
        // Create product
        const response = await axios.post(
          `${base_url}/api/product/create`,
          data,
          {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        setProducts((prev) => [...prev, response.data]);
        setToast({
          show: true,
          message: 'Product created successfully!',
          type: 'success',
        });
      }
      document.getElementById('product_modal').close();
      setImageFile(null);
      setImagePreview('');
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data || 'Failed to save product.',
        type: 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?'))
      return;
    try {
      await axios.delete(`${base_url}/api/product/delete/${productId}`, {
        withCredentials: true,
      });
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setToast({
        show: true,
        message: 'Product deleted successfully!',
        type: 'success',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data || 'Failed to delete product.',
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
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <button
        className="btn btn-primary mb-4"
        onClick={() => openProductModal()}
      >
        Create New Product
      </button>

      {/* Product List */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td>
                    {product.imageUrl ? (
                      <img
                        src={`${base_url}${product.imageUrl}`}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                        onClick={() => {
                          console.log(`${base_url}${product.imageUrl}`);
                        }}
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>₹ {product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button
                      className="btn btn-outline btn-sm mr-2"
                      onClick={() => openProductModal(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDelete(product._id)}
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

      {/* Product Modal */}
      <dialog id="product_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {selectedProduct ? 'Edit Product' : 'Create Product'}
          </h3>
          <div className="py-4">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="input input-bordered w-full"
              placeholder="Enter product name"
            />
            <label className="label">
              <span className="label-text">Price</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
              className="input input-bordered w-full"
              placeholder="Enter price"
              min="1"
              max="10000000"
            />
            <label className="label">
              <span className="label-text">Stock</span>
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleFormChange}
              className="input input-bordered w-full"
              placeholder="Enter stock"
              min="0"
              max="100000"
            />
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              className="select select-bordered w-full"
            >
              {validCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <label className="label">
              <span className="label-text">Image</span>
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleSubmit}>
              {selectedProduct ? 'Update' : 'Create'}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                document.getElementById('product_modal').close();
                setImagePreview('');
                setImageFile(null);
              }}
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

export default ManageProducts;
