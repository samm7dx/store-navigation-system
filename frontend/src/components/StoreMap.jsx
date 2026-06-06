import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, User, Star, ShoppingCart } from 'lucide-react';

const StoreMap = ({ layout, path, start, end, products, selectedProduct }) => {
  const rows = layout.length;
  const cols = layout[0].length;

  const [visiblePathIndex, setVisiblePathIndex] = useState(-1);

  useEffect(() => {
    if (path && path.length > 0) {
      setVisiblePathIndex(0);
      const interval = setInterval(() => {
        setVisiblePathIndex((prev) => {
          if (prev < path.length) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 50); // animate cell by cell
      return () => clearInterval(interval);
    } else {
      setVisiblePathIndex(-1);
    }
  }, [path]);

  const hasProduct = (r, c) => products.some(p => p.row === r && p.col === c);

  return (
    <div className="glass-card p-4 sm:p-6 flex flex-col items-center">
      
      {/* Legend */}
      <div className="w-full flex flex-wrap gap-4 items-center justify-center mb-6 text-xs font-medium text-gray-600 bg-white/50 py-3 px-4 rounded-xl">
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-blue-500 rounded-sm"></div> Entrance</div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-green-500 rounded-sm"></div> Product</div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-yellow-400 rounded-sm"></div> Path</div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-store-shelf rounded-sm"></div> Shelf</div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-store-floor border border-gray-100 rounded-sm"></div> Floor</div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-purple-500 rounded-sm"></div> Checkout</div>
      </div>

      <div 
        className="grid gap-1 sm:gap-2 bg-gray-100 p-2 sm:p-4 rounded-2xl shadow-inner w-full max-w-2xl aspect-square"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {layout.map((row, r) => 
          row.map((cell, c) => {
            const isStart = start[0] === r && start[1] === c;
            const isEnd = end && end[0] === r && end[1] === c;
            
            const pathIndex = path.findIndex(([pr, pc]) => pr === r && pc === c);
            const isPath = pathIndex !== -1;
            const isPathVisible = isPath && pathIndex <= visiblePathIndex;

            const isShelf = cell === 1;
            const isCheckout = cell === 2;
            const isSpecificTarget = selectedProduct && selectedProduct.row === r && selectedProduct.col === c;
            const isUnselectedProduct = !isSpecificTarget && hasProduct(r, c);

            let bgClass = isShelf ? 'bg-store-shelf bg-gray-800 shadow-md' : 'bg-store-floor bg-white';
            if (isCheckout) bgClass = 'bg-purple-100 border-2 border-purple-300';
            if (isPathVisible && !isStart && !isEnd) bgClass = 'bg-store-path bg-yellow-400 shadow-sm';
            if (isStart) bgClass = 'bg-store-entrance bg-blue-500 shadow-md';
            if (isSpecificTarget) bgClass = 'bg-store-product bg-green-500 shadow-lg ring-4 ring-green-200';

            return (
              <div 
                key={`${r}-${c}`}
                className={`relative flex items-center justify-center rounded-lg sm:rounded-xl transition-all duration-300 ${bgClass}`}
              >
                <AnimatePresence>
                  {isStart && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-white drop-shadow-md"
                    >
                      <User size={20} className="sm:w-6 sm:h-6" />
                    </motion.div>
                  )}
                  {isSpecificTarget && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-white drop-shadow-md"
                    >
                      <Star size={20} className="sm:w-6 sm:h-6 fill-current" />
                    </motion.div>
                  )}
                  {isCheckout && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-purple-600 drop-shadow-md"
                    >
                      <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
                    </motion.div>
                  )}
                  {/* Show all inventory dots if they are not the active target */}
                  {isUnselectedProduct && !isStart && !isPathVisible && (
                     <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-300 rounded-full"
                     />
                  )}
                  {isPathVisible && !isStart && !isSpecificTarget && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full opacity-50"
                    />
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StoreMap;
