const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');
const navigationController = require('../controllers/navigation');
const authController = require('../controllers/auth');

// Auth
router.post('/verify-admin', authController.verifyAdmin);

// Inventory Stats
router.get('/inventory/stats', productsController.getStats);

// Products
router.get('/products', productsController.getProducts);
router.get('/products/suggestions', productsController.getSuggestions);
router.post('/products', productsController.addProduct);
router.put('/products/:name', productsController.updateProduct);
router.delete('/products/:name', productsController.deleteProduct);
router.post('/products/import', productsController.importProducts);

// Navigation
router.post('/find-route', navigationController.findRoute);

module.exports = router;
