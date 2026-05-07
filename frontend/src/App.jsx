import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AuthSuccess from "./pages/AuthSuccess";
import AdminDashboard from "./pages/AdminDashboard";

// Components
import ProtectedRoute from "./component/ProtectedRoute";
import Layout from "./component/Layout";
import AdminRouter from "./component/AdminRouter";

// Redux
import { getCart as getCartApi, saveCart } from "./services/cartService";
import { setCart } from "./store/cartSlice";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  // Load cart after login
  useEffect(() => {
    if (user) {
      getCartApi(user._id)
        .then((res) => dispatch(setCart(res.data)))
        .catch((err) => console.error("Error loading cart:", err));
    }
  }, [user, dispatch]);

  // Sync cart to backend (debounced)
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      saveCart({ userId: user._id, items }).catch((err) =>
        console.error("Error saving cart:", err)
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [items, user]);

  return (
    <BrowserRouter>
      <Routes>
        {/* All regular pages wrapped in Layout (Navbar + Footer) */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/products" element={<Layout><Products /></Layout>} />
        <Route path="/products/:id" element={<Layout><ProductPage /></Layout>} />
        <Route path="/cart" element={<Layout><ProtectedRoute><Cart /></ProtectedRoute></Layout>} />
        <Route path="/checkout" element={<Layout><ProtectedRoute><Checkout /></ProtectedRoute></Layout>} />
        <Route path="/order-success" element={<Layout><ProtectedRoute><OrderSuccess /></ProtectedRoute></Layout>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<Layout><AdminRouter><AdminDashboard /></AdminRouter></Layout>} />

        {/* Auth pages – full-screen split, no Navbar/Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;