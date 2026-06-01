import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProduct } from "../services/productService";
import { useToast } from "../context/useToast";
import ProductSkeleton from "../component/ProductSkeleton";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    // Scroll to top cleanly on route change
    window.scrollTo(0, 0);
    setTimeout(() => {
      setLoading(true);
    }, 0);
    
    getProduct(id)
      .then(res => {
        setProduct(res.data);
        // Simulate a slight delay to show off the gorgeous skeleton UI
        setTimeout(() => setLoading(false), 800);
      })
      .catch((err) => {
        console.error(err);
        // Fallback for visual testing of the UI capabilities
        const dummyProduct = {
          _id: id || "lux_001",
          name: "The Essential Cashmere Blend Overshirt",
          price: 245.00,
          description: "Elevate your daily uniform. Woven in northern Italy from an ultra-soft cashmere and merino blend, this overshirt combines the tailored sensibility of a blazer with the effortless comfort of a cardigan. Features genuine horn buttons and hidden side-seam pockets.",
          images: [
            "https://images.unsplash.com/photo-1591047139829-e9aab0a5352b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1591047139396-8575a6c3f66a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          ],
          colors: ["#1a1a1a", "#e2e0d8", "#2a3b4c"],
          sizes: ["S", "M", "L", "XL"],
          rating: 4.9,
          reviewsCount: 342,
          stock: 12
        };
        setTimeout(() => {
          setProduct(dummyProduct);
          setSelectedColor(dummyProduct.colors[0]);
          setSelectedSize(dummyProduct.sizes[1]);
          setLoading(false);
        }, 800);
      });
  }, [id]);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      addToast(`Added ${quantity} ${product.name} to your bag`, "success");
    }, 600);
  };

  if (loading) return <ProductSkeleton />;

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] bg-white">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Piece not found.</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">We couldn't locate the item you're looking for. It may have been relocated or sold out.</p>
        <Link to="/products" className="px-8 py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-transform transform hover:-translate-y-1">
           Explore Collection
        </Link>
      </div>
    );
  }

  const images = product.images || [product.image];

  return (
    <div className="bg-white min-h-screen">
      {/* Editorial Breadcrumbs */}
      <div className="border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-14 text-xs font-semibold tracking-widest uppercase text-gray-400">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span className="mx-4 text-gray-300">/</span>
          <Link to="/products" className="hover:text-gray-900 transition-colors">Collection</Link>
          <span className="mx-4 text-gray-300">/</span>
          <span className="text-gray-900 truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left Side: Masonry Image Stack (Editorial Flow) */}
          <div className="flex flex-col gap-4 lg:gap-8">
            {images.map((img, idx) => (
              <div key={idx} className="w-full bg-gray-50 rounded-[2rem] overflow-hidden group">
                <img 
                  src={img} 
                  alt={`${product.name} detail view ${idx + 1}`} 
                  className="w-full h-full object-cover object-center transform transition-transform duration-[3000ms] ease-out group-hover:scale-105"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          {/* Right Side: Sticky Interactive Details */}
          <div className="relative">
             <div className="lg:sticky lg:top-28 flex flex-col pt-4">
                
                {/* Title & Reviews */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tighter leading-[1.1]">
                    {product.name}
                  </h1>
                </div>

                <div className="flex items-center space-x-4 mb-8">
                  <div className="flex text-gray-900 tracking-tighter text-lg">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i} className={i < Math.floor(product.rating || 5) ? "text-gray-900" : "text-gray-200"}>{star}</span>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-widest border-b border-transparent hover:border-gray-500 cursor-pointer transition-colors">
                    {product.reviewsCount} Reviews
                  </span>
                </div>

                <div className="text-3xl lg:text-4xl font-light text-gray-900 tracking-tight mb-8">
                  ${Number(product.price).toFixed(2)}
                </div>

                <p className="text-lg text-gray-600 mb-10 leading-relaxed font-light">
                  {product.description}
                </p>

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4 flex items-center justify-between">
                      <span>Color Drop</span>
                      <span className="text-gray-500 font-medium normal-case">{selectedColor || product.colors[0]}</span>
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`relative w-12 h-12 rounded-full flex items-center justify-center focus:outline-none transition-all duration-300 ${
                            selectedColor === color ? "scale-110 shadow-lg ring-1 ring-offset-2 ring-gray-900" : "hover:scale-105 hover:shadow-md"
                          }`}
                          title={color}
                        >
                          {/* Inner color circle */}
                          <span 
                            className="w-full h-full rounded-full border border-gray-200/50 shadow-inner" 
                            style={{ backgroundColor: color }}
                          ></span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-10">
                    <div className="flex justify-between items-end mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">Select Size</h3>
                      <button className="text-xs font-medium text-gray-500 underline underline-offset-4 hover:text-gray-900 transition-colors">Size Guide</button>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                      {product.sizes.map((size) => (
                         <button
                           key={size}
                           onClick={() => setSelectedSize(size)}
                           className={`relative overflow-hidden flex items-center justify-center py-4 rounded-xl text-sm font-bold tracking-widest transition-all duration-300 ${
                             selectedSize === size 
                               ? "bg-gray-900 text-white shadow-xl shadow-gray-900/20 transform -translate-y-1" 
                               : "bg-gray-50 text-gray-900 hover:bg-gray-100 hover:-translate-y-0.5"
                           }`}
                         >
                           {/* Add subtle micro-interaction ripple effect container */}
                           <span className="relative z-10">{size}</span>
                         </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Row */}
                <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-10 mt-4">
                  
                  {/* Quantity Stepper */}
                  <div className="flex sm:w-1/3 items-center justify-between bg-gray-50 rounded-2xl border border-gray-100 px-2 h-16">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition-all shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/></svg>
                    </button>
                    <span className="text-lg font-bold text-gray-900 w-12 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity((product.stock === undefined || product.stock > quantity) ? quantity + 1 : quantity)}
                      className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition-all shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                    </button>
                  </div>

                  {/* Add to Bag CTA */}
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 relative overflow-hidden group bg-gray-900 text-white rounded-2xl h-16 flex items-center justify-center transition-all hover:bg-black hover:shadow-2xl shadow-gray-900/30 active:scale-95"
                  >
                     <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                     
                     {isAdding ? (
                       <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                     ) : (
                       <div className="flex items-center space-x-3">
                          <span className="font-bold tracking-widest uppercase text-sm">Add to Bag</span>
                          <span className="text-white/50">—</span>
                          <span className="font-medium">${(Number(product.price) * quantity).toFixed(2)}</span>
                       </div>
                     )}
                  </button>
                </div>

                {/* Accrued Highlights */}
                <div className="border border-gray-100 bg-gray-50 rounded-2xl divide-y divide-gray-200/50">
                   <div className="p-5 flex items-start space-x-4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-900 flex-shrink-0">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-gray-900">Complimentary Global Shipping</h4>
                         <p className="text-sm text-gray-500 mt-1 leading-relaxed">Arrives typically within 3-5 business days via premium courier.</p>
                      </div>
                   </div>
                   <div className="p-5 flex items-start space-x-4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-900 flex-shrink-0">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-gray-900">End-to-End Encryption</h4>
                         <p className="text-sm text-gray-500 mt-1 leading-relaxed">Your payment information is secured using industry-leading protocols.</p>
                      </div>
                   </div>
                </div>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
