import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

export default function Navbar() {
  const user = useSelector((state) => state.auth?.user);
  const cartItemCount = useSelector((state) => state.cart?.items?.length || 0);
  const [activeLink, setActiveLink] = useState('/');

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    ...(user?.role === 'admin' || user?.role === 'superadmin' ? [{ path: '/admin-dashboard', label: 'Admin' }] : []),
    ...(user ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top Promo Bar */}
      <div className="bg-gray-900 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span>Free shipping worldwide</span>
              <span className="text-gray-600">|</span>
              <span>30-day guarantee</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/track-order" className="hover:text-gray-300">Track Order</Link>
              <Link to="/help" className="hover:text-gray-300">Help Center</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">SmartBazaar</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setActiveLink(item.path)}
                  className={`relative text-gray-600 hover:text-gray-900 transition group ${activeLink === item.path ? 'text-gray-900 font-medium' : ''
                    }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gray-900 transition-all duration-300 
              ${activeLink === item.path ? 'w-full' : 'w-0 group-hover:w-full'}`}
                  ></span>
                </Link>
              ))}
            </div>


            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition relative">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* User */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.name?.charAt(0) || user.email?.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-700 hidden sm:block">{user.name?.split(" ")[0]}</span>
                </div>
              ) : (
                <Link to="/login" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
                  Sign In
                </Link>
              )}
            </div>

          </div>
        </div>
      </nav>
    </>
  );
}
