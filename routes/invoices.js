const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all invoices
router.get('/', authenticateToken, authorizeRole(['admin', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER', 'ACCOUNTANT']), async (req, res) => {
  try {
    // Placeholder for invoice logic - in real app, you'd have an Invoice model
    const invoices = [
      {
        id: 'INV-001',
        invoiceNumber: 'INV-001',
        clientId: 'CUST001',
        clientName: 'شركة ألفا للتجارة',
        amount: 15000,
        currency: 'SAR',
        status: 'مدفوع',
        dueDate: '2024-01-15',
        services: ['شحن', 'تخليص'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'INV-002',
        invoiceNumber: 'INV-002',
        clientId: 'CUST002',
        clientName: 'أحمد محمد',
        amount: 8500,
        currency: 'SAR',
        status: 'معلق',
        dueDate: '2024-01-20',
        services: ['نقل'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'INV-003',
        invoiceNumber: 'INV-003',
        clientId: 'CUST003',
        clientName: 'مؤسسة النور',
        amount: 22000,
        currency: 'SAR',
        status: 'متأخر',
        dueDate: '2024-01-10',
        services: ['تخليص صادر'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    res.json({
      success: true,
      data: invoices,
      count: invoices.length
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get invoice by ID
router.get('/:id', authenticateToken, authorizeRole(['admin', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER', 'ACCOUNTANT']), async (req, res) => {
  try {
    // Placeholder - in real app, you'd fetch from database
    const invoice = {
      id: req.params.id,
      invoiceNumber: `INV-${req.params.id}`,
      clientId: 'CUST001',
      clientName: 'شركة ألفا للتجارة',
      amount: 15000,
      currency: 'SAR',
      status: 'مدفوع',
      dueDate: '2024-01-15',
      services: ['شحن', 'تخليص'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Create new invoice
router.post('/', authenticateToken, authorizeRole(['admin', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER', 'ACCOUNTANT']), async (req, res) => {
  try {
    const {
      invoiceNumber,
      clientId,
      clientName,
      amount,
      currency,
      status,
      dueDate,
      services
    } = req.body;

    // Validate required fields
    if (!invoiceNumber || !clientId || !clientName || !amount || !currency) {
      return res.status(400).json({
        success: false,
        message: 'Invoice number, client ID, client name, amount, and currency are required'
      });
    }

    // In real app, you'd save to database
    const invoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber,
      clientId,
      clientName,
      amount: Number(amount),
      currency,
      status: status || 'معلق',
      dueDate,
      services: services || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update invoice
router.put('/:id', authenticateToken, authorizeRole(['admin', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER', 'ACCOUNTANT']), async (req, res) => {
  try {
    // In real app, you'd update in database
    const invoice = {
      id: req.params.id,
      ...req.body,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Delete invoice
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'GENERAL_MANAGER']), async (req, res) => {
  try {
    // In real app, you'd delete from database
    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;
