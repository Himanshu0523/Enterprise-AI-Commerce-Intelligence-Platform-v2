import { useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";

const THRESHOLD = 20; 
const ZOOM_LEVELS = [1.5, 1.9, 2.5, 1.0]; // Click to cycle through zoom levels

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const imageRef = useRef(null);

  const [pos, setPos]           = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(1); // Start at 1.9x (index 1)
  const [zoomScale, setZoomScale] = useState(ZOOM_LEVELS[1]); // Default 1.9x
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();

    const rawX = ((e.clientX - rect.left) / rect.width)  * 100;
    const rawY = ((e.clientY - rect.top)  / rect.height) * 100;

    const x = Math.min(100, Math.max(0, rawX));
    const y = Math.min(100, Math.max(0, rawY));

    setPos({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovering(true),  []);
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setPos({ x: 50, y: 50 });
  }, []);

  /* ── Click to cycle zoom levels with smooth transition ── */
  const handleZoomClick = useCallback((e) => {
    e.stopPropagation(); // Prevent card click
    setIsTransitioning(true);
    
    const nextIndex = (zoomIndex + 1) % ZOOM_LEVELS.length;
    setZoomIndex(nextIndex);
    setZoomScale(ZOOM_LEVELS[nextIndex]);
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Match CSS transition duration
  }, [zoomIndex]);

  /* ── Styles ─────────────────────────────── */
  const transformOrigin = `${pos.x}% ${pos.y}%`;

  const imageStyle = {
    width:           "100%",
    height:          "100%",
    objectFit:       "cover",
    display:         "block",
    transform:       isHovering ? `scale(${zoomScale})` : "scale(1)",
    transformOrigin: isHovering ? transformOrigin : "50% 50%",
    transition:      isTransitioning 
      ? "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), transform-origin 80ms linear" // Bouncy smooth transition
      : "transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform-origin 80ms linear", // Normal hover transition
    willChange:      "transform",
    userSelect:      "none",
    WebkitUserDrag:  "none",
  };

  const placeholderStyle = {
    ...imageStyle,
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    background:      "#f3f4f6",
    color:           "#9ca3af",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col border border-gray-100 overflow-hidden">

      <div
        ref={imageRef}
        className="relative aspect-square bg-gray-50 cursor-crosshair select-none"
        style={{ overflow: "hidden" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {/* ── Product image ── */}
        {product?.image ? (
          <img
            src={product.image}
            alt={product.name ?? "Product"}
            style={imageStyle}
            draggable={false}
          />
        ) : (
          <div style={placeholderStyle}>
            <svg
              className="w-14 h-14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* ── Zone grid lines (20 % / 80 %) — shown while hovering ── */}
        {isHovering && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Horizontal */}
            <div className="absolute top-[20%] left-0 w-full h-px"
                 style={{ background: "rgba(255,255,255,0.35)" }} />
            <div className="absolute top-[80%] left-0 w-full h-px"
                 style={{ background: "rgba(255,255,255,0.35)" }} />
            {/* Vertical */}
            <div className="absolute left-[20%] top-0 h-full w-px"
                 style={{ background: "rgba(255,255,255,0.35)" }} />
            <div className="absolute left-[80%] top-0 h-full w-px"
                 style={{ background: "rgba(255,255,255,0.35)" }} />
          </div>
        )}

        {/* ── "New" badge — always visible, top-right ── */}
        <div className="absolute top-2 right-2 z-30 pointer-events-none">
          <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold
                           px-2 py-0.5 rounded-full shadow text-gray-700 tracking-wide">
            NEW
          </span>
        </div>

        {/* ── Clickable Zoom badge with pulse animation on change ── */}
        {isHovering && (
          <div 
            className="absolute top-2 left-2 z-30 cursor-pointer"
            onClick={handleZoomClick}
            title={`Click to change zoom (${zoomScale}× → ${ZOOM_LEVELS[(zoomIndex + 1) % ZOOM_LEVELS.length]}×)`}
          >
            <span className={`
              bg-indigo-600/90 hover:bg-indigo-700 backdrop-blur-sm text-white
              text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide
              transition-all duration-200 hover:scale-110 active:scale-95
              shadow-md hover:shadow-lg inline-block
              ${isTransitioning ? 'animate-pulse scale-125' : ''}
            `}>
              {zoomScale}×
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {product?.name}
        </h3>

        {product?.description && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3">
          {/* Price */}
          <p className="text-xl font-bold text-indigo-600">
            ₹{product?.price?.toLocaleString("en-IN")}
          </p>

          {/* Add-to-cart button */}
          <button
            onClick={() => dispatch(addToCart(product))}
            title="Add to Cart"
            className="
              flex items-center justify-center
              bg-indigo-600 hover:bg-indigo-700 active:scale-95
              text-white p-2 rounded-full
              shadow-md hover:shadow-lg
              transition-all duration-200
              hover:-translate-y-0.5
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            "
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184
                   1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}