const Shipment = require('../models/Shipment');

exports.calculateRates = async (req, res) => {
  try {
    const { items, destination } = req.body;
    // Calculate sample shipping methods & costs based on item count / destination
    const count = items ? items.reduce((acc, i) => acc + (i.quantity || 1), 0) : 1;
    const rates = [
      { id: 'standard', name: 'Standard Shipping', cost: 5.99 + count * 0.5, estimatedDays: '3-5 business days' },
      { id: 'express', name: 'Express Shipping', cost: 15.99 + count * 1.0, estimatedDays: '1-2 business days' },
      { id: 'overnight', name: 'Overnight Air', cost: 29.99 + count * 2.0, estimatedDays: '1 business day' },
    ];
    res.json({ rates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createShipment = async (req, res) => {
  try {
    const { orderId, userId, carrier = 'STANDARD', shippingAddress } = req.body;

    if (!orderId || !shippingAddress) {
      return res.status(400).json({ msg: 'orderId and shippingAddress are required' });
    }

    const trackingNumber = 'TRK-' + carrier + '-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
    const estimatedDeliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000); // 4 days out

    const shipment = await Shipment.create({
      orderId,
      userId: userId || 'guest',
      carrier,
      trackingNumber,
      shippingAddress,
      status: 'LABEL_CREATED',
      estimatedDeliveryDate,
      trackingHistory: [
        { status: 'LABEL_CREATED', location: 'Fulfillment Center', description: 'Shipping label created' },
      ],
    });

    res.status(201).json(shipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.trackShipment = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const shipment = await Shipment.findOne({ trackingNumber });
    if (!shipment) return res.status(404).json({ msg: 'Shipment not found' });
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, location, description } = req.body;

    const shipment = await Shipment.findById(id);
    if (!shipment) return res.status(404).json({ msg: 'Shipment not found' });

    shipment.status = status;
    shipment.trackingHistory.push({
      status,
      location: location || 'In Transit Hub',
      description: description || `Status updated to ${status}`,
    });

    await shipment.save();
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
