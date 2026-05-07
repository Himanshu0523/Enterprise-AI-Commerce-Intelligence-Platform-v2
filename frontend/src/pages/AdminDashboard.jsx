import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Service layer – adjust path according to project structure
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService"; // <-- corrected import

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // holds product id when editing
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    isNewProduct: false,
    isFeatured: false,
    isOnSale: false,
    stock: 0,
  });
  const [message, setMessage] = useState({ type: "", text: "" }); // success or error

  /* ---------- fetch all products ---------- */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getProducts(); // token is attached via interceptor
      setProducts(data.data);
      setMessage({});
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to load products" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------- form helpers ---------- */
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      isNewProduct: false,
      isFeatured: false,
      isOnSale: false,
      stock: 0,
    });
    setEditing(null);
  };

  const openForm = (product = null) => {
    if (product) {
      setEditing(product._id);
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        category: product.category || "",
        isNewProduct: product.isNewProduct || false,
        isFeatured: product.isFeatured || false,
        isOnSale: product.isOnSale || false,
        stock: product.stock || 0,
      });
    } else {
      resetForm();
    }
    setShowForm(true);
    setMessage({});
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
    setMessage({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await updateProduct(editing, formData);
        setMessage({ type: "success", text: "Product updated successfully" });
      } else {
        await createProduct(formData);
        setMessage({ type: "success", text: "Product created successfully" });
      }
      closeForm();
      fetchProducts();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Operation failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setLoading(true);
    try {
      await deleteProduct(id);
      setMessage({ type: "success", text: "Product deleted successfully" });
      fetchProducts();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to delete product" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* Message banner */}
      {message?.text && (
        <div
          className={`mb-4 p-3 rounded ${{
            error: "bg-red-100 border border-red-400 text-red-800",
            success: "bg-green-100 border border-green-400 text-green-800",
          }[message.type]}`}
        >
          {message.text}
        </div>
      )}

      {/* Add New button */}
      <button
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        onClick={() => openForm()}
      >
        + Add New Product
      </button>

      {/* Product table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Flags</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">Loading…</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.category}</td>
                  <td className="p-2">${p.price?.toFixed(2)}</td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2">
                    {p.isNewProduct && "New "}
                    {p.isFeatured && "Featured "}
                    {p.isOnSale && "Sale"}
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded"
                      onClick={() => openForm(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded"
                      onClick={() => handleDelete(p._id)}
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

      {/* Modal form – only rendered when showForm is true */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editing ? "Edit Product" : "Create New Product"}
            </h2>
            <form onSubmit={submitForm} className="space-y-4">
              {/* Name */}
              <label className="block">
                <span className="text-gray-700">Name</span>
                <input
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full border rounded p-2"
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>
              {/* Description */}
              <label className="block">
                <span className="text-gray-700">Description</span>
                <textarea
                  name="description"
                  rows={3}
                  className="mt-1 block w-full border rounded p-2"
                  value={formData.description}
                  onChange={handleChange}
                />
              </label>
              {/* Price */}
              <label className="block">
                <span className="text-gray-700">Price</span>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="mt-1 block w-full border rounded p-2"
                  value={formData.price}
                  onChange={handleChange}
                />
              </label>
              {/* Category */}
              <label className="block">
                <span className="text-gray-700">Category</span>
                <input
                  name="category"
                  type="text"
                  className="mt-1 block w-full border rounded p-2"
                  value={formData.category}
                  onChange={handleChange}
                />
              </label>
              {/* Stock */}
              <label className="block">
                <span className="text-gray-700">Stock</span>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  required
                  className="mt-1 block w-full border rounded p-2"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </label>
              {/* Flags */}
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    name="isNewProduct"
                    type="checkbox"
                    checked={formData.isNewProduct}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  New
                </label>
                <label className="flex items-center">
                  <input
                    name="isFeatured"
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Featured
                </label>
                <label className="flex items-center">
                  <input
                    name="isOnSale"
                    type="checkbox"
                    checked={formData.isOnSale}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  On Sale
                </label>
              </div>
              {/* Buttons */}
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={closeForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}