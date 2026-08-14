'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getUserOrders } from '@/services/orderService';
import { updateUser } from '@/services/userService';

export default function UserDashboard() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const ordersRes = await getUserOrders();
        const ordersArray = ordersRes.data?.data || ordersRes.data || [];
        const formattedOrders = ordersArray.map((order) => ({
          id: order._id || order.id,
          date: new Date(order.createdAt || Date.now()).toLocaleDateString(),
          total: order.total_price || order.totalAmount || order.total || 0,
          status: order.status || 'Processing',
          items: order.items?.length || order.orderItems?.length || 1,
        }));
        setOrders(formattedOrders);

        // Mock wishlist (replace with real service)
        setWishlist([
          { id: 1, name: 'Classic Spring Jacket', price: 120.0, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300' },
          { id: 2, name: 'Summer Dress', price: 89.99, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300' },
        ]);

        setProfileData({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          address: user?.address || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchUserData();
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(user._id, profileData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'orders', name: 'Orders', icon: '📦' },
    { id: 'wishlist', name: 'Wishlist', icon: '❤️' },
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your dashboard.</p>
          <Link href="/login" className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.name || user.email}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* ... stats cards unchanged ... */}
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* ... recent orders table unchanged ... */}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* ... all orders table unchanged ... */}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Wishlist</h3>
                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                        <div className="relative w-full h-48">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{item.name}</h4>
                          <p className="text-gray-900 font-medium">${item.price.toFixed(2)}</p>
                          <div className="flex space-x-2 mt-4">
                            <button className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800">
                              Add to Cart
                            </button>
                            <button className="px-3 py-2 border border-gray-300 rounded-lg text-red-500 hover:bg-red-50">
                              ❤️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Your wishlist is empty</p>
                    <Link href="/products" className="mt-2 inline-block text-gray-900 hover:underline">
                      Browse Products →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                {/* ... profile form unchanged ... */}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                {/* ... settings unchanged ... */}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}