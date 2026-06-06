import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const AnimatedNumber = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return animation.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
};

const DetailsPanel = ({ selectedProduct, routeData }) => {
  if (!selectedProduct) {
    return (
      <div className="glass-card p-6 h-full flex flex-col items-center justify-center text-gray-400 text-center min-h-[300px]">
        <div className="text-4xl mb-4">🛒</div>
        <p>Select a product to view routing details and statistics.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-6 text-indigo-900">Routing Details</h2>
      
      <div className="space-y-6 flex-1">
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-inner">
          <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-1">Target Product</h3>
          <p className="text-xl font-bold text-indigo-900 mb-2">{selectedProduct.name}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-indigo-400">Category:</span> <span className="font-medium text-indigo-900">{selectedProduct.category}</span></div>
            <div><span className="text-indigo-400">Zone:</span> <span className="font-medium text-indigo-900">{selectedProduct.zone}</span></div>
            <div className="col-span-2"><span className="text-indigo-400">Rack Type:</span> <span className="font-medium text-indigo-900">{selectedProduct.rackType}</span></div>
            <div className="col-span-2 mt-2 pt-2 border-t border-indigo-200 text-indigo-600 font-semibold">
              Location: Row {selectedProduct.row}, Column {selectedProduct.col}
            </div>
          </div>
        </div>

        {routeData && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-500 text-sm font-medium">Distance</span>
              <span className="font-bold text-indigo-600"><AnimatedNumber value={routeData.distance} /> Steps</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-500 text-sm font-medium">Nodes Visited</span>
              <span className="font-bold text-gray-900"><AnimatedNumber value={routeData.nodesVisited} /></span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-500 text-sm font-medium">Path Cells</span>
              <span className="font-bold text-gray-900"><AnimatedNumber value={routeData.path ? routeData.path.length : 0} /></span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-500 text-sm font-medium">Algorithm</span>
              <span className="font-semibold text-gray-900 text-right text-sm">Dijkstra <br/><span className="text-xs text-gray-400 font-normal">(Array Based)</span></span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-500 text-sm font-medium">Complexity</span>
              <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold text-sm">O(V²)</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 text-sm font-medium">Execution Mode</span>
              <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full">{routeData.mode === 'js' ? 'JavaScript Deployment' : 'C++ Local'}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DetailsPanel;
