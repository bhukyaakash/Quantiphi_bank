const express = require('express');
const router = express.Router();
const store = require('../data/store');
const parser = require('../services/parser');
const categorizer = require('../services/categorizer');

/**
 * GET /api/transactions
 * Get all transactions sorted by timestamp (newest first)
 */
router.get('/', (req, res) => {
  try {
    const transactions = store.getAllTransactions();
    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/transactions/summary
 * Get category summary and financial metrics
 */
router.get('/summary', (req, res) => {
  try {
    const categorySummary = store.getCategorySummary();
    const financialMetrics = store.getFinancialMetrics();
    const categories = categorizer.getCategories();
    const colors = categorizer.getCategoryColors();
    const icons = categorizer.getCategoryIcons();

    res.json({
      success: true,
      data: {
        categorySummary,
        financialMetrics,
        categories,
        colors,
        icons
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/transactions
 * Parse and create a new transaction from raw text
 */
router.post('/', (req, res) => {
  try {
    const { rawText } = req.body;

    if (!rawText || typeof rawText !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'rawText is required and must be a string'
      });
    }

    const parsedTransaction = parser.parseTransaction(rawText);
    store.addTransaction(parsedTransaction);

    res.status(201).json({
      success: true,
      message: 'Transaction parsed and created successfully',
      data: parsedTransaction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * PUT /api/transactions/:id/category
 * Update transaction category manually
 */
router.put('/:id/category', (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'category is required'
      });
    }

    if (!categorizer.isValidCategory(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${categorizer.getCategories().join(', ')}`
      });
    }

    const updatedTransaction = store.updateTransaction(id, { category });

    if (!updatedTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedTransaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/transactions/:id
 * Get single transaction by ID
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const transaction = store.getTransactionById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
