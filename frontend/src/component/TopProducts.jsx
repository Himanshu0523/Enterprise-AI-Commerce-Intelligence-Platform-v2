import { Link } from "react-router-dom";

export default function TopProducts({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <span className="text-gray-400 font-medium tracking-wide">Awaiting sales data...</span>
      </div>
    );
  }

  return (
    <div className="w-full relative rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden shadow-2xl p-8 my-4">
      
      {/* Ambient 3D Lighting / Blur Blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10 mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">Top Performing Items</h2>
          <p className="text-gray-400 mt-2 text-sm">Your highest rotating inventory based on confirmed orders.</p>
        </div>
        <div className="hidden sm:block">
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white text-sm font-medium transition-colors border border-white/10">
            View Analytics
          </button>
        </div>
      </div>

      {/* 3D Perspective Stage */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-8 perspective-[1500px]">
        {products.slice(0, 3).map((p, index) => (
          <div 
            key={index}
            className="group relative w-full sm:w-64 h-80 [transform-style:preserve-3d] transition-transform duration-700 hover:[transform:rotateY(12deg)_rotateX(8deg)_scale(1.02)] cursor-pointer"
          >
            {/* Deep Shadow Layer */}
            <div className="absolute inset-0 bg-black/60 rounded-3xl transform translate-z-[-30px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
            
            {/* Main Product Card */}
            <div className="absolute inset-0 bg-gray-100 rounded-3xl overflow-hidden shadow-xl border border-white/10 flex flex-col justify-end transform translate-z-[0px]">
              
              <div className="absolute inset-0">
                <img 
                  src={p.image || [
                    "https://images.unsplash.com/photo-1591047139829-e9aab0a5352b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    "https://images.unsplash.com/photo-1591047139396-8575a6c3f66a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  ][index % 3]}
                  alt={p.name} 
                  className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-125"
                />
                {/* Gradient structural overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/60 to-transparent"></div>
              </div>

              {/* Floating 3D Elements */}
              <div className="relative z-10 p-6 transform translate-z-[50px]">
                
                {/* Ranking Badge */}
                <div className="absolute -top-12 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform translate-z-[20px] group-hover:rotate-12 transition-transform">
                  #{index + 1}
                </div>

                <div className="inline-flex items-center px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded mb-3">
                  Trending
                </div>
                
                <h3 className="text-xl font-bold text-white leading-tight mb-2 line-clamp-2 drop-shadow-lg">
                  {p.name}
                </h3>
                
                <div className="flex items-center justify-between mt-4 pb-1 border-b border-white/20">
                  <p className="text-gray-300 text-xs uppercase tracking-wider">Units Sold</p>
                  <p className="text-lg font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    {p.sales ?? 0}
                  </p>
                </div>
              </div>

              {/* Glass Glare Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}