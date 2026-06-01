import { useProducts } from "../hooks/useProducts";
import RecommendationPanel from "../component/RecommendationPanel";
import ProductList from "../component/ProductList";
import { useSelector } from "react-redux";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";

export default function Home() {
  const productsData = useProducts();
  const products = useMemo(() => productsData || [], [productsData]);
  const user = useSelector((state) => state.auth?.user);
  const userId = user?.['_id'];
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoPlayIntervalRef = useRef(null);
  const slidesContainerRef = useRef(null);

  // Slideshow data
  const slidesData = useMemo(() => [
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Timeless Elegance",
      desc: "Discover our premium collection"
    },
    {
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Urban Collection",
      desc: "Street style redefined"
    },
    {
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Minimalist Luxury",
      desc: "Less is more"
    },
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Seasonal Trends",
      desc: "Fresh looks for every season"
    },
    {
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Artisan Craft",
      desc: "Handcrafted with care"
    }
  ], []);

  useEffect(() => {
    if (products.length > 0) {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [products]);

  const goToSlide = useCallback((index) => {
    if (index < 0) index = slidesData.length - 1;
    if (index >= slidesData.length) index = 0;
    setCurrentSlide(index);
    if (slidesContainerRef.current) {
      const offset = -index * 100;
      slidesContainerRef.current.style.transform = `translateX(${offset}%)`;
    }
  }, [slidesData.length]);

  const nextSlide = useCallback(() => {
    const nextIndex = currentSlide + 1;
    goToSlide(nextIndex);
  }, [currentSlide, goToSlide]);
  
  const prevSlide = useCallback(() => {
    const prevIndex = currentSlide - 1;
    goToSlide(prevIndex);
  }, [currentSlide, goToSlide]);

  const startAutoPlay = useCallback(() => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
    
    autoPlayIntervalRef.current = setInterval(() => {
      setCurrentSlide((prevSlide) => {
        const nextSlideIndex = (prevSlide + 1) % slidesData.length;
        if (slidesContainerRef.current) {
          const offset = -nextSlideIndex * 100;
          slidesContainerRef.current.style.transform = `translateX(${offset}%)`;
        }
        return nextSlideIndex;
      });
    }, 5000);
  }, [slidesData.length]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
  }, []);

  // Sync slidesContainerRef transform when currentSlide changes
  useEffect(() => {
    if (slidesContainerRef.current) {
      const offset = -currentSlide * 100;
      slidesContainerRef.current.style.transform = `translateX(${offset}%)`;
    }
  }, [currentSlide]);

  // Initialize slideshow
  useEffect(() => {
    const timer = setTimeout(() => {
      startAutoPlay();
    }, 0);
    
    return () => {
      clearTimeout(timer);
      stopAutoPlay();
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stopAutoPlay, prevSlide, nextSlide, startAutoPlay]);

  // Touch swipe support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const threshold = 50;
    if (touchStartX.current - touchEndX.current > threshold) {
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    } else if (touchEndX.current - touchStartX.current > threshold) {
      stopAutoPlay();
      prevSlide();
      startAutoPlay();
    }
  }, [stopAutoPlay, nextSlide, prevSlide, startAutoPlay]);

  const categories = useMemo(() => [
    { id: "all", name: "All Products", count: products.length },
    { id: "new", name: "New Arrivals", count: products.filter(p => p.isNewProduct).length },
    { id: "featured", name: "Featured", count: products.filter(p => p.isFeatured).length },
    { id: "sale", name: "Sale", count: products.filter(p => p.isOnSale).length }
  ], [products]);

  return (
    <div className="bg-white">
      {/* Hero Section with Slideshow - Infinite Auto-Update */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
        <div className="relative h-[600px] lg:h-[700px] overflow-hidden">
          <div 
            ref={slidesContainerRef}
            className="flex transition-transform duration-700 ease-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onMouseEnter={stopAutoPlay}
            onMouseLeave={startAutoPlay}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {slidesData.map((slide, idx) => (
              <div key={idx} className="flex-shrink-0 w-full h-full relative">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white z-10">
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <p className="text-base md:text-xl text-gray-200 max-w-2xl drop-shadow">
                    {slide.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {slidesData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { stopAutoPlay(); goToSlide(idx); startAutoPlay(); }}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === idx
                    ? "w-8 h-2 bg-white"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Overlay Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl">
              Discover Your
              <span className="block text-amber-400">Perfect Style</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow">
              Explore our curated collection of premium fashion pieces.
            </p>
          </div>
        </div>
      </div>

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
            if (activeCategory === "new") return p.isNewProduct;
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
    </div>
  );
}