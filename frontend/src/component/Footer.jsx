import { Link } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <>
      {/* Newsletter */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay in the Loop</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to receive updates on new arrivals, special offers, and exclusive content.
          </p>
          <form
            className="flex max-w-md mx-auto gap-3"
            onSubmit={(e) => { e.preventDefault(); setEmail(""); }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-gray-600"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Subscribe
            </button>
          </form>
          <p className="text-gray-400 text-sm mt-4">No spam, unsubscribe anytime.</p>
        </div>
      </div>

      {/* Footer Links */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Shop</h3>
              <ul className="space-y-2">
                <li><Link to="/products" className="text-gray-600 hover:text-gray-900 text-sm">All Products</Link></li>
                <li><Link to="/products?category=new" className="text-gray-600 hover:text-gray-900 text-sm">New Arrivals</Link></li>
                <li><Link to="/products?category=sale" className="text-gray-600 hover:text-gray-900 text-sm">Sale</Link></li>
                <li><Link to="/products?category=featured" className="text-gray-600 hover:text-gray-900 text-sm">Featured</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/faq" className="text-gray-600 hover:text-gray-900 text-sm">FAQ</Link></li>
                <li><Link to="/shipping" className="text-gray-600 hover:text-gray-900 text-sm">Shipping Info</Link></li>
                <li><Link to="/returns" className="text-gray-600 hover:text-gray-900 text-sm">Returns</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-gray-900 text-sm">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 hover:text-gray-900 text-sm">About Us</Link></li>
                <li><Link to="/careers" className="text-gray-600 hover:text-gray-900 text-sm">Careers</Link></li>
                <li><Link to="/blog" className="text-gray-600 hover:text-gray-900 text-sm">Blog</Link></li>
                <li><Link to="/press" className="text-gray-600 hover:text-gray-900 text-sm">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Instagram</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Twitter</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Facebook</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-500 text-sm">© 2026 HexaShop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
