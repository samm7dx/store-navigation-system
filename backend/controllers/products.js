const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/products.json');
const layoutPath = path.join(__dirname, '../data/storeLayout.json');

const getStoreLayout = () => {
    try {
        const data = fs.readFileSync(layoutPath, 'utf8');
        return JSON.parse(data);
    } catch(e) {
        return null;
    }
};

const readProducts = () => {
    try {
        if (!fs.existsSync(dataPath)) return [];
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const writeProducts = (products) => {
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
};

exports.getProducts = (req, res) => {
    const products = readProducts();
    res.json(products);
};

exports.getSuggestions = (req, res) => {
    const q = req.query.q || '';
    const products = readProducts();
    if (!q) {
        return res.json([]);
    }
    const suggestions = products
        .filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
        .map(p => p.name);
    
    res.json([...new Set(suggestions)]);
};

exports.getStats = (req, res) => {
    const products = readProducts();
    
    const categoriesSet = new Set();
    let refrigeratedItems = 0;
    let openRackItems = 0;
    let frozenItems = 0;

    products.forEach(p => {
        if (p.category) categoriesSet.add(p.category);
        
        const rack = (p.rackType || '').toLowerCase();
        if (rack.includes('refrigerated')) refrigeratedItems++;
        if (rack.includes('open')) openRackItems++;
        if (rack.includes('freezer') || rack.includes('frozen')) frozenItems++;
    });

    res.json({
        totalProducts: products.length,
        categories: categoriesSet.size,
        refrigeratedItems,
        openRackItems,
        frozenItems
    });
};

exports.addProduct = (req, res) => {
    const { name, category, zone, rackType, row, col } = req.body;
    if (!name || row === undefined || col === undefined) {
        return res.status(400).json({ error: 'Missing required product details' });
    }

    const products = readProducts();
    if (products.find(p => p.name.toLowerCase() === name.toLowerCase())) {
        return res.status(400).json({ error: 'Product already exists' });
    }

    const grid = getStoreLayout();
    if (grid && grid[row] && grid[row][col] === 1) {
        return res.status(400).json({ error: 'Cannot place product on obstacle.' });
    }

    const newId = products.length > 0 ? Math.max(...products.map(p => p.id || 0)) + 1 : 1;
    const newProduct = { 
        id: newId, 
        name, 
        category: category || 'Uncategorized', 
        zone: zone || 'Uncategorized Zone',
        rackType: rackType || 'Standard Shelf',
        row: parseInt(row), 
        col: parseInt(col) 
    };
    
    products.push(newProduct);
    writeProducts(products);

    res.status(201).json(newProduct);
};

exports.updateProduct = (req, res) => {
    const { name } = req.params;
    const { newName, category, zone, rackType, row, col } = req.body;
    
    let products = readProducts();
    const index = products.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
    
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    let newRow = row !== undefined ? parseInt(row) : products[index].row;
    let newCol = col !== undefined ? parseInt(col) : products[index].col;

    const grid = getStoreLayout();
    if (grid && grid[newRow] && grid[newRow][newCol] === 1) {
        return res.status(400).json({ error: 'Cannot place product on obstacle.' });
    }

    products[index] = {
        ...products[index],
        name: newName || products[index].name,
        category: category || products[index].category,
        zone: zone || products[index].zone,
        rackType: rackType || products[index].rackType,
        row: newRow,
        col: newCol
    };

    writeProducts(products);
    res.json(products[index]);
};

exports.deleteProduct = (req, res) => {
    const { name } = req.params;
    let products = readProducts();
    const initialLength = products.length;
    
    products = products.filter(p => p.name.toLowerCase() !== name.toLowerCase());
    
    if (products.length === initialLength) {
        return res.status(404).json({ error: 'Product not found' });
    }

    writeProducts(products);
    res.json({ message: 'Product deleted' });
};

exports.importProducts = (req, res) => {
    const { products: importedProducts } = req.body;
    
    if (!Array.isArray(importedProducts)) {
        return res.status(400).json({ error: 'Expected an array of products' });
    }

    let products = readProducts();
    let currentId = products.length > 0 ? Math.max(...products.map(p => p.id || 0)) + 1 : 1;

    for (const item of importedProducts) {
        if (!item.name || item.row === undefined || item.col === undefined) continue;
        
        const existingIndex = products.findIndex(p => p.name.toLowerCase() === item.name.toLowerCase());
        
        if (existingIndex >= 0) {
            products[existingIndex] = {
                ...products[existingIndex],
                category: item.category || products[existingIndex].category,
                zone: item.zone || products[existingIndex].zone,
                rackType: item.rackType || products[existingIndex].rackType,
                row: parseInt(item.row),
                col: parseInt(item.col)
            };
        } else {
            products.push({
                id: currentId++,
                name: item.name,
                category: item.category || 'Uncategorized',
                zone: item.zone || 'Uncategorized Zone',
                rackType: item.rackType || 'Standard Shelf',
                row: parseInt(item.row),
                col: parseInt(item.col)
            });
        }
    }

    writeProducts(products);
    res.json({ message: 'Products imported successfully', count: importedProducts.length });
};
