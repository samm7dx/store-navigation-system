import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, deleteProduct, importProducts, getStats, updateProduct } from '../services/api';
import { getCategoryData, categories } from '../data/categories';
import { Trash2, Upload, Box, Tags, Snowflake, Database, Layers } from 'lucide-react';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Dairy', row: '', col: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [importFile, setImportFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showCoordinates, setShowCoordinates] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const pData = await getProducts();
      setProducts(pData);
      const sData = await getStats();
      setStats(sData);
    } catch (err) {
      setError('Failed to load dashboard data');
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { zone, rackType } = getCategoryData(newProduct.category);
      await addProduct({ ...newProduct, zone, rackType });
      setNewProduct({ name: '', category: 'Dairy', row: '', col: '' });
      showSuccess('Product added successfully!');
      loadData();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name) => {
    if(!window.confirm(`Delete ${name}?`)) return;
    try {
      await deleteProduct(name);
      loadData();
    } catch (err) {
      showError('Failed to delete product');
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!importFile) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        let imported = [];
        if (importFile.name.endsWith('.csv')) {
           const text = event.target.result;
           const rows = text.split('\n');
           const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
           
           for(let i=1; i<rows.length; i++) {
             if(!rows[i].trim()) continue;
             const vals = rows[i].split(',');
             let item = {};
             headers.forEach((h, idx) => {
                if(h === 'racktype') item.rackType = vals[idx]?.trim();
                else item[h] = vals[idx]?.trim();
             });
             imported.push(item);
           }
        } else {
           imported = JSON.parse(event.target.result);
        }

        setLoading(true);
        const res = await importProducts(imported);
        showSuccess(`Imported ${res.count} products!`);
        setImportFile(null);
        loadData();
      } catch (err) {
        showError('Failed to parse file or import data.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(importFile);
  };

  const handleGridClick = async (r, c) => {
     if (!selectedProduct) {
        setNewProduct({ ...newProduct, row: r, col: c });
        return;
     }

     if(window.confirm(`Move ${selectedProduct.name} to Row ${r}, Col ${c}?`)) {
         try {
            await updateProduct(selectedProduct.name, { row: r, col: c });
            showSuccess(`Moved ${selectedProduct.name} successfully!`);
            setSelectedProduct(null);
            loadData();
         } catch (e) {
            showError(e.response?.data?.error || 'Failed to relocate product');
         }
     }
  };

  const rows = 10;
  const cols = 10;
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

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
             <Box className="w-8 h-8 text-indigo-500 mb-2"/>
             <span className="text-2xl font-bold text-gray-900">{stats.totalProducts}</span>
             <span className="text-xs text-gray-500 uppercase tracking-wider">Total Products</span>
          </div>
          <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
             <Tags className="w-8 h-8 text-purple-500 mb-2"/>
             <span className="text-2xl font-bold text-gray-900">{stats.categories}</span>
             <span className="text-xs text-gray-500 uppercase tracking-wider">Categories</span>
          </div>
          <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
             <Snowflake className="w-8 h-8 text-blue-500 mb-2"/>
             <span className="text-2xl font-bold text-gray-900">{stats.refrigeratedItems}</span>
             <span className="text-xs text-gray-500 uppercase tracking-wider">Refrigerated</span>
          </div>
          <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
             <Layers className="w-8 h-8 text-orange-500 mb-2"/>
             <span className="text-2xl font-bold text-gray-900">{stats.openRackItems}</span>
             <span className="text-xs text-gray-500 uppercase tracking-wider">Open Rack</span>
          </div>
          <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
             <Database className="w-8 h-8 text-teal-500 mb-2"/>
             <span className="text-2xl font-bold text-gray-900">{stats.frozenItems}</span>
             <span className="text-xs text-gray-500 uppercase tracking-wider">Frozen</span>
          </div>
        </div>
      )}

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow-sm border border-red-200">{error}</div>}
      {successMsg && <div className="p-4 bg-green-100 text-green-700 rounded-lg shadow-sm border border-green-200">{successMsg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-indigo-900">Interactive Store Grid</h3>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-indigo-600">
                <input type="checkbox" checked={showCoordinates} onChange={e => setShowCoordinates(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500"/>
                Show Coordinates
              </label>
            </div>
            
            <div className="grid gap-1 bg-gray-200 p-2 rounded-xl shadow-inner aspect-square mb-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
              {layout.map((rowArr, r) => 
                rowArr.map((cell, c) => {
                  let isShelf = cell === 1;
                  let isCheckout = cell === 2;
                  let hasProduct = products.find(p => p.row === r && p.col === c);
                  let isSelected = selectedProduct && selectedProduct.row === r && selectedProduct.col === c;

                  let bgColor = isShelf ? 'bg-store-shelf' : 'bg-store-floor hover:bg-indigo-200 cursor-pointer';
                  if(isCheckout) bgColor = 'bg-purple-100 border-2 border-purple-300';
                  if(isSelected) bgColor = 'bg-indigo-500 border-2 border-white text-white shadow-md z-10';
                  else if(hasProduct) bgColor = 'bg-green-400 border border-green-500 cursor-pointer';

                  return (
                    <div 
                      key={`${r}-${c}`} 
                      onClick={() => !isShelf && handleGridClick(r, c)}
                      className={`relative w-full h-full rounded-sm ${bgColor} transition-all flex items-center justify-center`}
                      title={`R:${r} C:${c}${hasProduct ? ` - ${hasProduct.name}` : ''}`}
                    >
                      {showCoordinates && (
                        <span className={`text-[10px] sm:text-xs font-mono font-medium ${isShelf ? 'text-gray-400' : isSelected ? 'text-white' : 'text-gray-500'}`}>
                          {r},{c}
                        </span>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {selectedProduct && (
              <div className="bg-indigo-50 p-3 rounded-lg flex justify-between items-center border border-indigo-100">
                <div>
                   <p className="text-xs text-indigo-500 uppercase font-semibold">Relocating Mode</p>
                   <p className="text-sm font-medium">{selectedProduct.name}</p>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="text-xs bg-white border border-indigo-200 px-2 py-1 rounded text-indigo-700 hover:bg-indigo-100">Cancel</button>
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-indigo-900">Add Product Manually</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Product Name</label>
                <input 
                  type="text" required
                  className="w-full px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-200"
                  value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Category</label>
                <select 
                  className="w-full px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-200"
                  value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                >
                  {categories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Row (0-9)</label>
                  <input type="number" required min="0" max="9" className="w-full px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-200" value={newProduct.row} onChange={e => setNewProduct({...newProduct, row: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Col (0-9)</label>
                  <input type="number" required min="0" max="9" className="w-full px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-200" value={newProduct.col} onChange={e => setNewProduct({...newProduct, col: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors shadow-md">
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-900 flex items-center gap-2"><Upload className="w-5 h-5"/> Import Products</h3>
              <form onSubmit={handleImport} className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                   <label className="block text-sm text-gray-600 mb-1">Select CSV or JSON file</label>
                   <input type="file" accept=".csv,.json" onChange={e => setImportFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
                </div>
                <button type="submit" disabled={!importFile || loading} className="w-full sm:w-auto bg-green-600 text-white px-8 py-2.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium shadow-md">Upload</button>
              </form>
           </div>

           <div className="glass-card p-6 flex flex-col h-[600px]">
              <h3 className="text-lg font-semibold mb-4 text-indigo-900">Store Inventory</h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                      <th className="px-6 py-4 font-semibold text-gray-600">Category/Zone</th>
                      <th className="px-6 py-4 font-semibold text-gray-600">Location</th>
                      <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400">No products found. Start adding inventory!</td></tr>
                    ) : (
                      products.map((p, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                          <td className="px-6 py-4">
                             <div className="text-gray-900 font-medium">{p.category}</div>
                             <div className="text-xs text-gray-500 mt-0.5">{p.zone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              R:{p.row}, C:{p.col}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button onClick={() => setSelectedProduct(p)} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-100 font-medium transition-colors">Relocate</button>
                            <button onClick={() => handleDelete(p.name)} className="text-red-400 hover:text-red-600 transition-colors p-1.5 rounded hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
