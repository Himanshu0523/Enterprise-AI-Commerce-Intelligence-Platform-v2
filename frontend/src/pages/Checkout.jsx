
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// If you have a clearCart action, it should be imported here:
import { setCart } from "../store/cartSlice";
import API from "../services/api";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const { items } = useSelector((state) => state.cart || { items: [] });
  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    firstName: user?.name?.split(' ')[0] || "",
    lastName: user?.name?.split(' ')[1] || "",
    address: user?.address || "",
    city: "",
    country: "United States",
    zipCode: "",
    phone: user?.phone || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const shipping = items?.length > 0 ? (subtotal > 150 ? 0 : 15.00) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Create order on backend
      const { data } = await API.post("/payment/create-order", {
        items: items.map(item => ({
            product_id: item.product_id || item._id, // Adapt to your item structure
            quantity: item.quantity,
            price: item.price
        })),
        total_price: total,
        shippingAddress: shippingDetails
      });

      const { order, razorpayOrder } = data.data;

      // 2. Setup Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "E-Commerce App",
        description: "Test Transaction",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // 3. Verify payment on backend
            const verifyRes = await API.post("/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order._id
            });

            if (verifyRes.data.success) {
              dispatch(setCart([]));
              navigate("/order-success", { state: { order: verifyRes.data.data } });
            }
          } catch (err) {
            console.error("Payment verification failed", err);
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
          email: user?.email || "",
          contact: shippingDetails.phone
        },
        theme: {
          color: "#111827"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while processing the payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <Link to="/products" className="text-blue-600 hover:text-blue-500 font-medium pb-1 border-b-2 border-blue-600">
          Return to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex items-center text-sm font-medium text-gray-500">
          <Link to="/cart" className="hover:text-gray-900 transition">Cart</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Checkout</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Form */}
          <div className="lg:w-2/3">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Checkout</h1>
            
            <form onSubmit={handleCheckoutSubmit} className="space-y-10">
              {/* Shipping Address Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm mr-3">1</span>
                  Shipping Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input required type="text" name="firstName" value={shippingDetails.firstName} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-gray-900 focus:border-gray-900 sm:text-sm" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input required type="text" name="lastName" value={shippingDetails.lastName} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-gray-900 focus:border-gray-900 sm:text-sm" placeholder="Doe" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input required type="tel" name="phone" value={shippingDetails.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-gray-900 focus:border-gray-900 sm:text-sm" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input required type="text" name="address" value={shippingDetails.address} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-gray-900 focus:border-gray-900 sm:text-sm" placeholder="123 Shopping Blvd" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input required type="text" name="city" value={shippingDetails.city} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-gray-900 focus:border-gray-900 sm:text-sm" placeholder="New York" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                    <input required type="text" name="zipCode" value={shippingDetails.zipCode} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-gray-900 focus:border-gray-900 sm:text-sm" placeholder="10001" />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm mr-3">2</span>
                  Payment Method
                </h2>

                <div className="space-y-4">
                  {/* Credit Card Option */}
                  <label className={`flex items-center p-5 border rounded-xl cursor-pointer transition ${paymentMethod === 'credit_card' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="paymentMethod" value="credit_card" checked={paymentMethod === 'credit_card'} onChange={() => setPaymentMethod('credit_card')} className="w-4 h-4 text-gray-900 focus:ring-gray-900 border-gray-300" />
                    <span className="ml-4 flex-1">
                      <span className="block text-sm font-medium text-gray-900">Razorpay (Cards, UPI, NetBanking)</span>
                      <span className="block text-sm text-gray-500">Secure payment processing via Razorpay</span>
                    </span>
                    <div className="flex space-x-2">
                       <span className="text-xl">💳</span>
                    </div>
                  </label>
                </div>

                {/* Simulated Card Inputs Removed (handled by Razorpay modal) */}
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className={`px-10 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-gray-800 transition transform hover:-translate-y-0.5 flex items-center ${isProcessing ? 'opacity-70 cursor-not-allowed transform-none' : ''}`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>Pay ${total.toFixed(2)}</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <ul className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <li key={item._id} className="py-4 flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                        <img src={item.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                        <div className="text-xs text-gray-500 mt-1 flex justify-between">
                          <span>Qty: {item.quantity}</span>
                          <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (8%)</span>
                  <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-gray-900">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500">Including ${(tax + shipping).toFixed(2)} in taxes and fees.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
