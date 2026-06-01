import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Service layer
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getMyStats,
} from "../services/productService";
import { getUsers, updateUserRole, deleteUser } from "../services/userService";
import { getAllOrders } from "../services/orderService";

export default function AdminDashboard() {
  const user = useSelector((state) => state.auth?.user);
  const isSuperAdmin = user?.role === "superadmin";

  const [activeTab, setActiveTab] = useState("products");
  const [viewMode, setViewMode] = useState("my"); // "my" or "all" (superadmin only)

  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "", description: "", price: 0, category: "",
    isNewProduct: false, isFeatured: false, isOnSale: false, stock: 0,
  });

  // Seller stats
  const [stats, setStats] = useState(null);

  // Users and Orders state
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  /* ---------- Fetch Data ---------- */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let result;
      if (isSuperAdmin && viewMode === "all") {
        result = await getProducts();
      } else {
        result = await getMyProducts(
          isSuperAdmin && viewMode === "my" ? { sellerId: user._id } : {}
        );
      }
      const list = result?.data || result || [];
      setProducts(Array.isArray(list) ? list : []);
      setMessage({});
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to load products" });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params = isSuperAdmin && viewMode === "my" ? { sellerId: user._id } : {};
      const result = await getMyStats(params);
      setStats(result?.data || null);
    } catch (err) {
      console.error("Stats fetch error", err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getUsers();
      setUsers(data);
      setMessage({});
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to load users" });
    } finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await getAllOrders();
      setOrders(data.data || data);
      setMessage({});
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to load orders" });
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (activeTab === "products") { fetchProducts(); fetchStats(); }
    if (activeTab === "users") fetchUsers();
    if (activeTab === "orders") fetchOrders();
  }, [activeTab, viewMode]);

  /* ---------- Ownership helpers ---------- */
  const isOwner = (product) => {
    const sellerId = product?.seller?._id || product?.seller;
    return String(sellerId) === String(user?._id);
  };
  const canEdit = (product) => isSuperAdmin || isOwner(product);

  /* ---------- Product Form Helpers ---------- */
  const resetForm = () => {
    setFormData({ name: "", description: "", price: 0, category: "", isNewProduct: false, isFeatured: false, isOnSale: false, stock: 0 });
    setEditing(null);
  };

  const openForm = (product = null) => {
    if (product) {
      setEditing(product._id);
      setFormData({
        name: product.name || "", description: product.description || "", price: product.price || 0,
        category: product.category || "", isNewProduct: product.isNewProduct || false,
        isFeatured: product.isFeatured || false, isOnSale: product.isOnSale || false, stock: product.stock || 0,
      });
    } else { resetForm(); }
    setShowForm(true);
    setMessage({});
  };

  const closeForm = () => { setShowForm(false); resetForm(); setMessage({}); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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
      fetchStats();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Operation failed" });
    } finally { setLoading(false); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setLoading(true);
    try {
      await deleteProduct(id);
      setMessage({ type: "success", text: "Product deleted successfully" });
      fetchProducts();
      fetchStats();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to delete product" });
    } finally { setLoading(false); }
  };

  /* ---------- User Handlers ---------- */
  const handleToggleRole = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    if (!window.confirm(`Change ${u.name}'s role to ${newRole}?`)) return;
    setLoading(true);
    try {
      await updateUserRole(u._id, newRole);
      setMessage({ type: "success", text: "User role updated" });
      fetchUsers();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update role" });
    } finally { setLoading(false); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    setLoading(true);
    try {
      await deleteUser(id);
      setMessage({ type: "success", text: "User deleted" });
      fetchUsers();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to delete user" });
    } finally { setLoading(false); }
  };

  /* ========== STYLES ========== */
  const s = {
    page: { maxWidth: 1280, margin: "0 auto", padding: 32, fontFamily: "'Inter','Segoe UI',sans-serif", color: "#1e293b", minHeight: "100vh", background: "linear-gradient(135deg,#f8fafc 0%,#eef2ff 100%)" },
    heading: { fontSize: 28, fontWeight: 800, marginBottom: 4, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    subtitle: { fontSize: 14, color: "#64748b", marginBottom: 24 },
    tabs: { display: "flex", gap: 8, borderBottom: "2px solid #e2e8f0", marginBottom: 24 },
    tab: (active) => ({ padding: "10px 20px", fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", borderRadius: "8px 8px 0 0", background: active ? "#4f46e5" : "transparent", color: active ? "#fff" : "#64748b", transition: "all .2s" }),
    viewToggle: { display: "flex", gap: 4, marginBottom: 20, background: "#e2e8f0", borderRadius: 8, padding: 4, width: "fit-content" },
    viewBtn: (active) => ({ padding: "8px 18px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: active ? "#4f46e5" : "transparent", color: active ? "#fff" : "#64748b", transition: "all .2s" }),
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 24 },
    statCard: (bg) => ({ background: bg, borderRadius: 12, padding: "20px 24px", color: "#fff", boxShadow: "0 4px 14px rgba(0,0,0,.1)" }),
    statLabel: { fontSize: 12, fontWeight: 600, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1 },
    statValue: { fontSize: 28, fontWeight: 800, marginTop: 4 },
    addBtn: { padding: "10px 22px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", marginBottom: 16, fontSize: 14 },
    table: { width: "100%", borderCollapse: "separate", borderSpacing: 0, background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,.06)" },
    th: { padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, background: "#f8fafc", borderBottom: "2px solid #e2e8f0" },
    td: { padding: "12px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 14 },
    badge: (bg, color) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: bg, color, marginRight: 4 }),
    editBtn: { padding: "5px 14px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 12, marginRight: 6 },
    delBtn: { padding: "5px 14px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 12 },
    disabledBtn: { padding: "5px 14px", background: "#cbd5e1", color: "#94a3b8", border: "none", borderRadius: 6, cursor: "not-allowed", fontWeight: 600, fontSize: 12, marginRight: 6 },
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, backdropFilter: "blur(4px)" },
    modal: { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 520, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,.15)", maxHeight: "90vh", overflowY: "auto" },
    input: { width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, marginTop: 4, outline: "none", boxSizing: "border-box" },
    label: { display: "block", marginBottom: 14, fontSize: 13, fontWeight: 600, color: "#374151" },
    msgBanner: (type) => ({ marginBottom: 16, padding: "12px 18px", borderRadius: 10, fontWeight: 600, fontSize: 14, background: type === "error" ? "#fef2f2" : "#f0fdf4", color: type === "error" ? "#dc2626" : "#16a34a", border: `1px solid ${type === "error" ? "#fecaca" : "#bbf7d0"}` }),
  };

  /* ========== RENDER: STATS ========== */
  const renderStats = () => {
    if (!stats) return null;
    const cards = [
      { label: "Total Products", value: stats.totalProducts ?? 0, bg: "linear-gradient(135deg,#4f46e5,#7c3aed)" },
      { label: "Stock Value", value: `₹${(stats.totalStockValue ?? 0).toLocaleString()}`, bg: "linear-gradient(135deg,#059669,#10b981)" },
      { label: "Low Stock", value: stats.lowStockCount ?? 0, bg: "linear-gradient(135deg,#d97706,#f59e0b)" },
      { label: "Out of Stock", value: stats.outOfStockCount ?? 0, bg: "linear-gradient(135deg,#dc2626,#ef4444)" },
    ];
    return (
      <div style={s.statsGrid}>
        {cards.map((c) => (
          <div key={c.label} style={s.statCard(c.bg)}>
            <div style={s.statLabel}>{c.label}</div>
            <div style={s.statValue}>{c.value}</div>
          </div>
        ))}
      </div>
    );
  };

  /* ========== RENDER: PRODUCTS ========== */
  const renderProducts = () => (
    <>
      {/* Superadmin view toggle */}
      {isSuperAdmin && (
        <div style={s.viewToggle}>
          <button style={s.viewBtn(viewMode === "my")} onClick={() => setViewMode("my")}>My Products</button>
          <button style={s.viewBtn(viewMode === "all")} onClick={() => setViewMode("all")}>All Products</button>
        </div>
      )}

      {renderStats()}

      <button style={s.addBtn} onClick={() => openForm()}>+ Add New Product</button>

      <div style={{ overflowX: "auto" }}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Name</th>
              <th style={s.th}>Category</th>
              <th style={s.th}>Price</th>
              <th style={s.th}>Stock</th>
              <th style={s.th}>Seller</th>
              <th style={s.th}>Flags</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ ...s.td, textAlign: "center", color: "#94a3b8" }}>Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} style={{ ...s.td, textAlign: "center", color: "#94a3b8" }}>No products found</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} style={{ transition: "background .15s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={s.td}>{p.name}</td>
                  <td style={s.td}>{p.category}</td>
                  <td style={{ ...s.td, fontWeight: 700 }}>₹{p.price?.toFixed(2)}</td>
                  <td style={s.td}>
                    <span style={s.badge(p.stock === 0 ? "#fef2f2" : p.stock <= 5 ? "#fffbeb" : "#f0fdf4", p.stock === 0 ? "#dc2626" : p.stock <= 5 ? "#d97706" : "#16a34a")}>
                      {p.stock}
                    </span>
                  </td>
                  <td style={s.td}>
                    {isOwner(p)
                      ? <span style={s.badge("#eef2ff", "#4f46e5")}>Owned</span>
                      : <span style={s.badge("#f1f5f9", "#64748b")}>{p.sellerName || "Other"}</span>
                    }
                  </td>
                  <td style={s.td}>
                    {p.isNewProduct && <span style={s.badge("#dbeafe", "#2563eb")}>New</span>}
                    {p.isFeatured && <span style={s.badge("#f3e8ff", "#7c3aed")}>Featured</span>}
                    {p.isOnSale && <span style={s.badge("#fef2f2", "#dc2626")}>Sale</span>}
                  </td>
                  <td style={s.td}>
                    {canEdit(p) ? (
                      <>
                        <button style={s.editBtn} onClick={() => openForm(p)}>Edit</button>
                        <button style={s.delBtn} onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                      </>
                    ) : (
                      <span style={s.disabledBtn}>No Access</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  /* ========== RENDER: USERS ========== */
  const renderUsers = () => (
    <div style={{ overflowX: "auto" }}>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Name</th><th style={s.th}>Email</th><th style={s.th}>Role</th><th style={s.th}>Joined</th><th style={s.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} style={{ ...s.td, textAlign: "center" }}>Loading...</td></tr>
          ) : users.map((u) => (
            <tr key={u._id}>
              <td style={s.td}>{u.name}</td>
              <td style={s.td}>{u.email}</td>
              <td style={s.td}>
                <span style={s.badge(u.role === "superadmin" ? "#fef3c7" : u.role === "admin" ? "#eef2ff" : "#f1f5f9", u.role === "superadmin" ? "#b45309" : u.role === "admin" ? "#4f46e5" : "#64748b")}>{u.role}</span>
              </td>
              <td style={s.td}>{new Date(u.created_at).toLocaleDateString()}</td>
              <td style={s.td}>
                <button style={s.editBtn} onClick={() => handleToggleRole(u)}>{u.role === "admin" ? "Demote" : "Promote"}</button>
                <button style={s.delBtn} onClick={() => handleDeleteUser(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* ========== RENDER: ORDERS ========== */
  const renderOrders = () => (
    <div style={{ overflowX: "auto" }}>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Order ID</th><th style={s.th}>User</th><th style={s.th}>Items</th><th style={s.th}>Total</th><th style={s.th}>Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} style={{ ...s.td, textAlign: "center" }}>Loading...</td></tr>
          ) : orders.map((o) => (
            <tr key={o._id}>
              <td style={{ ...s.td, fontSize: 12, color: "#94a3b8" }}>{o._id}</td>
              <td style={s.td}>{o.user_id?.name || "Unknown"}</td>
              <td style={s.td}>{o.items?.length || 0} items</td>
              <td style={{ ...s.td, fontWeight: 700 }}>₹{o.total_price?.toFixed(2)}</td>
              <td style={s.td}>{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* ========== MAIN RENDER ========== */
  return (
    <div style={s.page}>
      <h1 style={s.heading}>Admin Dashboard</h1>
      <p style={s.subtitle}>
        {isSuperAdmin ? "Super Admin — Full marketplace access" : `Seller Dashboard — ${user?.name || "Admin"}`}
      </p>

      {/* Tabs */}
      <div style={s.tabs}>
        {["products", "users", "orders"].map((tab) => (
          <button key={tab} style={s.tab(activeTab === tab)} onClick={() => { setActiveTab(tab); setMessage({}); }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Message banner */}
      {message?.text && <div style={s.msgBanner(message.type)}>{message.text}</div>}

      {/* Tab Content */}
      {activeTab === "products" && renderProducts()}
      {activeTab === "users" && renderUsers()}
      {activeTab === "orders" && renderOrders()}

      {/* Modal form */}
      {showForm && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>{editing ? "Edit Product" : "Create New Product"}</h2>
            <form onSubmit={submitForm}>
              <label style={s.label}>Name <input name="name" type="text" required style={s.input} value={formData.name} onChange={handleChange} /></label>
              <label style={s.label}>Description <textarea name="description" rows={3} style={{ ...s.input, resize: "vertical" }} value={formData.description} onChange={handleChange} /></label>
              <label style={s.label}>Price <input name="price" type="number" min="0" step="0.01" required style={s.input} value={formData.price} onChange={handleChange} /></label>
              <label style={s.label}>Category <input name="category" type="text" style={s.input} value={formData.category} onChange={handleChange} /></label>
              <label style={s.label}>Stock <input name="stock" type="number" min="0" required style={s.input} value={formData.stock} onChange={handleChange} /></label>
              <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}><input name="isNewProduct" type="checkbox" checked={formData.isNewProduct} onChange={handleChange} /> New</label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}><input name="isFeatured" type="checkbox" checked={formData.isFeatured} onChange={handleChange} /> Featured</label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}><input name="isOnSale" type="checkbox" checked={formData.isOnSale} onChange={handleChange} /> On Sale</label>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" style={{ ...s.addBtn, background: "#e2e8f0", color: "#475569" }} onClick={closeForm}>Cancel</button>
                <button type="submit" style={s.addBtn}>{editing ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}