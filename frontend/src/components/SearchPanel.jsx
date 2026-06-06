import React, { useState, useEffect } from 'react';
import { Search, X, History } from 'lucide-react';
import { getSuggestions } from '../services/api';

const SearchPanel = ({ products, onSearch, onClear, loading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveRecentSearch = (name) => {
    if (!name) return;
    let updated = [name, ...recentSearches.filter(s => s.toLowerCase() !== name.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() === '') {
        setSuggestions([]);
        return;
      }
      try {
        const res = await getSuggestions(query);
        setSuggestions(res);
      } catch (err) {
        console.error("Failed to fetch suggestions");
      }
    };
    
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (name) => {
    setQuery(name);
    setSuggestions([]);
    const product = products.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (product) {
        onSearch(product);
        saveRecentSearch(product.name);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    onClear();
  };

  const handleSearchClick = () => {
    const product = products.find(p => p.name.toLowerCase() === query.toLowerCase());
    if (product) {
        onSearch(product);
        saveRecentSearch(product.name);
    }
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-4 text-indigo-900">Search Product</h2>
      
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            placeholder="E.g., Milk, Bread..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
          />
          {query && (
            <button onClick={handleClear} className="absolute right-3 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto">
            {suggestions.map((name, i) => (
              <li 
                key={i} 
                onClick={() => handleSelect(name)}
                className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b last:border-0 border-gray-50 transition-colors text-sm"
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button 
        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center shadow-md hover:shadow-lg"
        onClick={handleSearchClick}
        disabled={loading || !query}
      >
        {loading ? 'Generating Route...' : 'Find Route'}
      </button>

      {recentSearches.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <History className="w-3.5 h-3.5" /> Recent Searches
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s, i) => (
              <button 
                key={i}
                onClick={() => handleSelect(s)}
                className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPanel;
