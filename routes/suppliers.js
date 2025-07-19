const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all suppliers
router.get('/', authenticateToken, authorizeRole(['admin', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER']), async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json({
      success: true,
      data: suppliers,
      count: suppliers.length
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get supplier by ID
router.get('/:id', authenticateToken, authorizeRole(['admin', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER']), async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }
    res.json({
      success: true,
      data: supplier
    });
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Create new supplier
router.post('/', authenticateToken, authorizeRole(['admin', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER']), async (req, res) => {
  try {
    const {
      name,
      type,
      phone,
      email,
      address,
      contactPerson,
      taxNumber,
      idNumber
    } = req.body;

    // Validate required fields
    if (!name || !type || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name, type, phone, and email are required'
      });
    }

    // Check if supplier already exists
    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) {
      return res.status(400).json({
        success: false,
        message: 'Supplier with this email already exists'
      });
    }

    const supplier = new Supplier({
      name,
      type,
      phone,
      email,
      address,
      contactPerson,
      taxNumber,
      idNumber
    });

    await supplier.save();

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: supplier
    });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update supplier
router.put('/:id', authenticateToken, authorizeRole(['admin', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER']), async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    res.json({
      success: true,
      message: 'Supplier updated successfully',
      data: supplier
    });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Delete supplier
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'GENERAL_MANAGER']), async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    res.json({
      success: true,
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router; 