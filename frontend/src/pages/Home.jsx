import React, { useState, useEffect } from 'react';
import SearchPanel from '../components/SearchPanel';
import StoreMap from '../components/StoreMap';
import DetailsPanel from '../components/DetailsPanel';
import { getProducts, findRoute } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const startPos = [9, 0];

  const layout = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2]
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = async (product) => {
    setSelectedProduct(product);
    setLoading(true);
    setRouteData(null);
    try {
      const result = await findRoute(startPos, [product.row, product.col]);
      setRouteData(result);
    } catch (err) {
      console.error("Route calculation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedProduct(null);
    setRouteData(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-8">
        <SearchPanel 
          products={products} 
          onSearch={handleSearch} 
          onClear={handleClear} 
          loading={loading} 
        />
        <div className="hidden lg:block">
          <DetailsPanel 
            selectedProduct={selectedProduct} 
            routeData={routeData} 
          />
        </div>
      </div>
      
      <div className="lg:col-span-8">
        <StoreMap 
          layout={layout} 
          path={routeData?.path || []} 
          start={startPos} 
          end={selectedProduct ? [selectedProduct.row, selectedProduct.col] : null} 
          products={products}
          selectedProduct={selectedProduct}
        />
      </div>

      <div className="block lg:hidden mt-8">
        <DetailsPanel 
          selectedProduct={selectedProduct} 
          routeData={routeData} 
        />
      </div>
    </div>
  );
};

export default Home;
