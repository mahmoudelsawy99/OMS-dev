const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all shipments
router.get('/', authenticateToken, authorizeRole(['admin', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER', 'DRIVER']), async (req, res) => {
  try {
    // Placeholder for shipment logic - in real app, you'd have a Shipment model
    const shipments = [
      {
        id: 'TRK-001',
        trackingNumber: 'TRK-001',
        orderId: 'OP00001',
        status: 'في الطريق',
        origin: 'الرياض',
        destination: 'جدة',
        estimatedDelivery: '2024-01-25',
        currentLocation: 'مكة المكرمة',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'TRK-002',
        trackingNumber: 'TRK-002',
        orderId: 'OP00002',
        status: 'تم التسليم',
        origin: 'جدة',
        destination: 'الدمام',
        estimatedDelivery: '2024-01-20',
        currentLocation: 'الدمام',
        deliveredAt: '2024-01-19',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    res.json({
      success: true,
      data: shipments,
      count: shipments.length
    });
  } catch (error) {
    console.error('Error fetching shipments:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get shipment by ID
router.get('/:id', authenticateToken, authorizeRole(['admin', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER', 'DRIVER']), async (req, res) => {
  try {
    // Placeholder - in real app, you'd fetch from database
    const shipment = {
      id: req.params.id,
      trackingNumber: `TRK-${req.params.id}`,
      orderId: 'OP00001',
      status: 'في الطريق',
      origin: 'الرياض',
      destination: 'جدة',
      estimatedDelivery: '2024-01-25',
      currentLocation: 'مكة المكرمة',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      success: true,
      data: shipment
    });
  } catch (error) {
    console.error('Error fetching shipment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Create new shipment
router.post('/', authenticateToken, authorizeRole(['admin', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER']), async (req, res) => {
  try {
    const {
      trackingNumber,
      orderId,
      status,
      origin,
      destination,
      estimatedDelivery,
      currentLocation,
      vehicleId,
      driverId
    } = req.body;

    // Validate required fields
    if (!trackingNumber || !orderId || !origin || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Tracking number, order ID, origin, and destination are required'
      });
    }

    // In real app, you'd save to database
    const shipment = {
      id: `TRK-${Date.now()}`,
      trackingNumber,
      orderId,
      status: status || 'تم إنشاؤه',
      origin,
      destination,
      estimatedDelivery,
      currentLocation: currentLocation || origin,
      vehicleId,
      driverId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Shipment created successfully',
      data: shipment
    });
  } catch (error) {
    console.error('Error creating shipment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update shipment
router.put('/:id', authenticateToken, authorizeRole(['admin', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER', 'DRIVER']), async (req, res) => {
  try {
    // In real app, you'd update in database
    const shipment = {
      id: req.params.id,
      ...req.body,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Shipment updated successfully',
      data: shipment
    });
  } catch (error) {
    console.error('Error updating shipment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update shipment status
router.patch('/:id/status', authenticateToken, authorizeRole(['admin', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER', 'DRIVER']), async (req, res) => {
  try {
    const { status, currentLocation } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // In real app, you'd update in database
    const shipment = {
      id: req.params.id,
      status,
      currentLocation,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Shipment status updated successfully',
      data: shipment
    });
  } catch (error) {
    console.error('Error updating shipment status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Delete shipment
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'GENERAL_MANAGER']), async (req, res) => {
  try {
    // In real app, you'd delete from database
    res.json({
      success: true,
      message: 'Shipment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting shipment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;
