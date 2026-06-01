import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useToast } from "../context/useToast";

export default function Products() {
  const products = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimer = useRef(null);

  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");

  // Filters state
  const [filters, setFilters] = useState({
    categories: urlCategory ? [urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)] : [],
    priceRange: [0, 1000],
    colors: []
  });

  const [sortBy, setSortBy] = useState("newest");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categoriesList = ["Men", "Women", "Kids", "Accessories", "Shoes"];
  const colorList = [
    { name: "Black", class: "bg-black" },
    { name: "White", class: "bg-white border-gray-300" },
    { name: "Blue", class: "bg-blue-600" },
    { name: "Red", class: "bg-red-600" },
    { name: "Green", class: "bg-green-600" },
  ];

  // Search via backend when query changes (debounced)
  useEffect(() => {
    if (!searchQuery.trim()) return;
    clearTimeout(searchTimer.current);
    setIsSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(searchQuery)}`);
        const json = await res.json();
        if (json.success) {
          setFilteredProducts(json.data);
        }
      } catch (error) {
        console.error("Search failed:", error);
        // Fallback to client-side filter if backend unreachable
        const regex = new RegExp(searchQuery, "i");
        setFilteredProducts(products.filter(p => 
          regex.test(p.name) || 
          regex.test(p.category?.name || p.category) || 
          regex.test(p.description)
        ));
      } finally {
        setIsSearching(false);
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(searchTimer.current);
  }, [searchQuery, products]);

  // URL category sync and filtering
  useEffect(() => {
    const queryCat = searchParams.get("category");
    if (queryCat) {
      const properCat = queryCat.charAt(0).toUpperCase() + queryCat.slice(1);
      setFilters(prev => 
        prev.categories.includes(properCat) 
          ? prev 
          : { ...prev, categories: [properCat] }
      );
    }

    if (products.length > 0) {
      applyFiltersAndSort(products);
      setLoading(false);
    } else {
      setLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, filters, sortBy, searchParams]);

  const applyFiltersAndSort = (baseProducts) => {
    let result = [...baseProducts];

    // Filter by Category
    if (filters.categories.length > 0) {
      result = result.filter(p => {
        const pCat = p.category?.name?.toLowerCase() || p.category?.toLowerCase() || "";
        return filters.categories.some(c => {
          const target = c.toLowerCase();
          if (target === "new") return p.isNew;
          if (target === "sale") return p.isOnSale;
          if (target === "featured") return p.isFeatured;
          return pCat.includes(target);
        });
      });
    }

    // Filter by Price
    result = result.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Filter by Colors (if implemented in backend)
    if (filters.colors.length > 0) {
      result = result.filter(p => 
        p.colors && p.colors.some(c => filters.colors.includes(c))
      );
    }

    // Sort
    if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredProducts(result);
  };

  const handleCategoryToggle = (category) => {
    setFilters(prev => {
      const isSelected = prev.categories.includes(category);
      return {
        ...prev,
        categories: isSelected 
          ? prev.categories.filter(c => c !== category)
          : [...prev.categories, category]
      };
    });
  };

  const handlePriceChange = (e, index) => {
    const value = parseInt(e.target.value) || 0;
    setFilters(prev => {
      const newRange = [...prev.priceRange];
      newRange[index] = value;
      return { ...prev, priceRange: newRange };
    });
  };

  const handleAddToCartRapid = (product) => {
    addToast(`${product.name} added to cart`, "success");
  };

  return (
    <div className="bg-white min-h-screen">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .perspective-container {
          perspective: 2000px;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Region */}
        <div className="flex justify-between items-baseline border-b border-gray-200 pb-6 mb-6 mt-6 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900">The Catalog</h1>
          
          <div className="flex items-center space-x-6">
            {/* Sort Dropdown */}
            <div className="relative inline-block text-left relative z-20">
              <select 
                title="Sort Products"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="group inline-flex justify-center text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 focus:border-gray-900 focus:ring-0 cursor-pointer transition-all pb-1"
              >
                <option value="newest">Newest Drops</option>
                <option value="price_asc">Price: Ascending</option>
                <option value="price_desc">Price: Descending</option>
              </select>
            </div>

            {/* Mobile filter button */}
            <button 
              type="button" 
              className="p-2 -mr-2 text-gray-400 hover:text-gray-900 transition-colors lg:hidden rounded-full hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Filters</span>
              <svg className="w-6 h-6" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="relative mb-10 z-10">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="product-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, category, description…"
              className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900 transition"
              >
                ✕
              </button>
            )}
            {isSearching && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
              </div>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs text-gray-500 mt-2 ml-1">
              {isSearching ? "Searching…" : `${filteredProducts.length} result${filteredProducts.length !== 1 ? "s" : ""} for "${searchQuery}"`}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-x-12 relative z-10">
          
          {/* Extended Luxury Sidebar Filters */}
          <div className="hidden lg:block lg:w-1/4 pr-4">
            <form className="sticky top-32 space-y-12">
              
              {/* Category Filter */}
              <div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-gray-900 rounded-full"></span>
                  <span>Categories</span>
                </h3>
                <div className="space-y-4">
                  {categoriesList.map((category) => (
                    <div key={category} className="flex items-center group relative cursor-pointer">
                      <input 
                        id={`filter-${category}`} 
                        type="checkbox" 
                        checked={filters.categories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="peer h-5 w-5 rounded border-2 border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer transition-all hover:border-gray-900" 
                      />
                      <label htmlFor={`filter-${category}`} className="ml-4 text-sm font-medium text-gray-500 cursor-pointer peer-checked:text-gray-900 peer-checked:font-bold transition-all duration-300 group-hover:text-gray-900">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="pt-10 border-t border-gray-100">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-gray-900 rounded-full"></span>
                  <span>Price Range</span>
                </h3>
                <div className="flex items-center justify-between gap-4">
                  <div className="relative group/input">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-gray-900 font-medium transition-colors">$</span>
                    <input 
                      type="number" 
                      min="0"
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      className="w-full pl-9 pr-4 py-3 bg-gray-50 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-gray-900 border-none shadow-inner transition-all" 
                    />
                  </div>
                  <span className="text-gray-300 font-bold tracking-widest">—</span>
                  <div className="relative group/input">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-gray-900 font-medium transition-colors">$</span>
                    <input 
                      type="number" 
                      min="0"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      className="w-full pl-9 pr-4 py-3 bg-gray-50 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-gray-900 border-none shadow-inner transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* Colors Filter */}
              <div className="pt-10 border-t border-gray-100">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-gray-900 rounded-full"></span>
                  <span>Palette</span>
                </h3>
                <div className="flex flex-wrap gap-4">
                  {colorList.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      title={color.name}
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        colors: prev.colors.includes(color.name) 
                          ? prev.colors.filter(c => c !== color.name)
                          : [...prev.colors, color.name]
                      }))}
                      className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center focus:outline-none transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md ${color.class} ${filters.colors.includes(color.name) ? 'ring-2 ring-offset-4 ring-gray-900 scale-110' : 'border-transparent'}`}
                    >
                      <span className="sr-only">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Product Grid Area */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-[60vh]">
                 <div className="flex space-x-2">
                   {[1,2,3].map(i => <div key={i} className={`w-4 h-4 bg-gray-900 rounded-full animate-bounce`} style={{animationDelay: `${i * 0.15}s`}}></div>)}
                 </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-32 px-4 border-2 border-dashed border-gray-200 rounded-[3rem] bg-gray-50">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-6">
                   <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                   </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">No Matches Found</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">We couldn't locate pieces matching your parameters.</p>
                <button 
                  onClick={() => setFilters({ categories: [], priceRange: [0, 1000], colors: [] })}
                  className="inline-flex items-center px-8 py-4 border border-transparent text-sm font-bold uppercase tracking-widest rounded-xl text-white bg-gray-900 hover:bg-black transition-all transform hover:-translate-y-1 shadow-lg"
                >
                  Clear Adjustments
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-16 gap-x-8 perspective-container pt-8">
                {filteredProducts.map((product, index) => (
                  <div 
                    key={product._id} 
                    className="group relative rounded-[2.5rem] p-4 bg-white hover:bg-gray-50/50 transition-all duration-[800ms] [transform-style:preserve-3d] hover:[transform:rotateY(10deg)_rotateX(6deg)_scale(1.02)] cursor-pointer shadow-sm hover:shadow-2xl border border-gray-100 hover:border-transparent animate-fade-in-up"
                    style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
                  >
                    {/* Atmospheric 3D Drop Shadow */}
                    <div className="absolute inset-0 bg-black/5 rounded-[2.5rem] transform translate-z-[-20px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"></div>
                    
                    {/* Main Image Plate */}
                    <Link to={`/products/${product._id}`} className="block w-full h-[24rem] bg-gray-100 rounded-[2rem] overflow-hidden relative shadow-inner transform translate-z-[0px]">
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1591047139829-e9aab0a5352b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-[1.15] transition-transform duration-[2000ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                      />
                      
                      {/* Premium Dark Veil Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      
                      {/* Interactive Quick Add Pop-out Container */}
                      <div className="absolute inset-x-0 bottom-0 p-5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-8 group-hover:translate-y-0 flex justify-center transform translate-z-[50px]">
                        <button 
                          onClick={(e) => { e.preventDefault(); handleAddToCartRapid(product); }}
                          className="relative overflow-hidden w-full bg-white/95 backdrop-blur-md text-gray-900 font-black tracking-widest uppercase text-xs py-5 px-4 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.3)] border border-white/60 hover:bg-white transform transition-transform hover:scale-105 active:scale-95 group/btn"
                        >
                          <span className="relative z-10 flex items-center justify-between">
                            <span>Quick Add</span>
                            <span className="px-2 py-1 bg-gray-100 rounded text-[10px] tabular-nums text-gray-900 border border-gray-200">${product.price}</span>
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900/5 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                        </button>
                      </div>

                      {/* 3D Floating Tags */}
                      {(product.isNew || product.isOnSale) && (
                        <div className="absolute top-5 left-5 flex flex-col gap-3 transform translate-z-[40px]">
                          {product.isNew && <span className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] bg-white text-gray-900 rounded-full shadow-xl border border-gray-100">Genesis Release</span>}
                          {product.isOnSale && <span className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] bg-red-600 text-white rounded-full shadow-xl">Archive Sale</span>}
                        </div>
                      )}
                    </Link>
                    
                    {/* Typography Plate */}
                    <Link to={`/products/${product._id}`} className="block mt-8 px-4 pb-4 transform translate-z-[30px]">
                       <h3 className="text-[10px] text-gray-400 uppercase tracking-[0.25em] font-bold mb-3">{product.category?.name || product.category || "Foundation Core"}</h3>
                       <div className="flex flex-col gap-3">
                         <h2 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors drop-shadow-sm">{product.name}</h2>
                         <p className="text-xl font-black text-gray-900 tracking-tighter">${product.price}</p>
                       </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}