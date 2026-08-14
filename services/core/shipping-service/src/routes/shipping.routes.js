const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shipping.controller');

router.post('/calculate', shippingController.calculateRates);
router.post('/shipment', shippingController.createShipment);
router.get('/track/:trackingNumber', shippingController.trackShipment);
router.patch('/shipment/:id/status', shippingController.updateShipmentStatus);

module.exports = router;
