const express = require('express');
const router = express.Router();
const shopCtrl = require('../controllers/yshop');

router.get('/maillots', shopCtrl.getProducts);
router.get('/maillots/:id', shopCtrl.getProductById);
router.put('/maillots/:id/stock', shopCtrl.updateStock);

module.exports = router;