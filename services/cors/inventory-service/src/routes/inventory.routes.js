const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');

router.get('/:sku', inventoryController.getInventoryBySku);
router.post('/', inventoryController.setInventory);
router.post('/reserve', inventoryController.reserveStock);
router.post('/release', inventoryController.releaseStock);
router.post('/adjust', inventoryController.adjustStock);

module.exports = router;
