import { useProducts } from "../hooks/useProducts";
import RecommendationPanel from "../component/RecommendationPanel";
import ProductList from "../component/ProductList";
import { useSelector } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const productsData = useProducts();
  const products = useMemo(() => productsData || [], [productsData]);
  const user = useSelector((state) => state.auth?.user);
  const userId = user?.['_id'];
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    if (products.length > 0) {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [products]);

  const categories = [
    { id: "all", name: "All Products", count: products.length },
    { id: "new", name: "New Arrivals", count: products.filter(p => p.isNewProduct).length },
    { id: "featured", name: "Featured", count: products.filter(p => p.isFeatured).length },
    { id: "sale", name: "Sale", count: products.filter(p => p.isOnSale).length }
  ];

  const features = useMemo(() => [
    {
      icon: "🚚",
      title: "Free Shipping",
      description: "On orders over $50",
      color: "bg-blue-50"
    },
    {
      icon: "🔄",
      title: "30-Day Returns",
      description: "Hassle-free returns",
      color: "bg-green-50"
    },
    {
      icon: "💳",
      title: "Secure Payment",
      description: "100% secure transactions",
      color: "bg-purple-50"
    },
    {
      icon: "🎧",
      title: "24/7 Support",
      description: "Dedicated customer service",
      color: "bg-orange-50"
    }
  ], []);

  const testimonials = useMemo(() => [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Fashion Blogger",
      content: "Exceptional quality and service. The attention to detail is remarkable.",
      rating: 5,
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Business Executive",
      content: "Fast delivery and premium products. Will definitely shop again.",
      rating: 5,
      avatar: "MC"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Style Consultant",
      content: "The collection is curated perfectly. Found exactly what I needed.",
      rating: 5,
      avatar: "ER"
    }
  ], []);

  const categories_list = [
    { name: "Men's Latest", image: "https://images.unsplash.com/photo-1617137968427-85924c800ebe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", link: "/products?category=men", description: "Lorem ipsum is simply dummy" },
    { name: "Women's Latest", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", link: "/products?category=women", description: "Lorem ipsum is simply dummy" },
    { name: "Kid's Latest", image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", link: "/products?category=kids", description: "Lorem ipsum is simply dummy" },
    { name: "Accessories", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", link: "/products?category=accessories", description: "Lorem ipsum is simply dummy" }
  ];


  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-gray-900/[0.02] bg-[size:50px_50px]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Summer Collection 2026
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Discover Your
                <span className="block text-gray-600">Perfect Style</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Explore our curated collection of premium fashion pieces. 
                Designed for those who appreciate quality, comfort, and timeless elegance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition transform hover:scale-105">
                  Shop Now
                </Link>
                <Link to="/collections" className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  View Collections
                </Link>
              </div>
              <div className="flex items-center space-x-8 mt-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-bold text-gray-900">15K+</div>
                  <div className="text-sm text-gray-500">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-500">Products</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-500">Brands</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 hidden lg:block">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <div className="font-semibold">4.9/5 Rating</div>
                    <div className="text-sm text-gray-500">Based on 2,345 reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={`${feature.color} rounded-xl p-6 text-center hover:shadow-lg transition`}>
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories_list.map((category) => (
            <Link 
              key={category.name}
              to={category.link}
              className="group relative overflow-hidden rounded-2xl aspect-square"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-white text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-white/90 text-sm mb-2">{category.description}</p>
                <p className="text-white text-sm font-medium">Discover More →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-600 mt-2">Hand-picked just for you</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition ${
                  activeCategory === category.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {userId && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Recommended for You</h3>
                <span className="text-sm text-gray-500">Based on your browsing history</span>
              </div>
              <RecommendationPanel userId={userId} />
            </div>
          </div>
        )}

        {isLoading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-500">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <ProductList products={products.filter(p => {
            if (activeCategory === "all") return true;
            if (activeCategory === "new") return p.isNew;
            if (activeCategory === "featured") return p.isFeatured;
            if (activeCategory === "sale") return p.isOnSale;
            return true;
          })} />
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No products available</h3>
            <p className="mt-2 text-gray-500">Check back later for new arrivals</p>
          </div>
        )}
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="text-gray-600 mt-2">Trusted by thousands of happy shoppers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-medium">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}