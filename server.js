const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const transactionRoutes = require('./routes/transactions');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/transactions', transactionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Bank Transaction Manager API',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Bank Transaction UPI Summary API',
    endpoints: {
      transactions: '/api/transactions',
      summary: '/api/transactions/summary',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     BANK TRANSACTION UPI SUMMARY API SERVER            ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  Server running on http://localhost:${PORT}              ║`);
  console.log('║  API Endpoints:                                        ║');
  console.log('║    • GET  /api/transactions       - List transactions  ║');
  console.log('║    • GET  /api/transactions/summary - Analytics data   ║');
  console.log('║    • POST /api/transactions       - Parse new alert    ║');
  console.log('║    • PUT  /api/transactions/:id/category - Update tag  ║');
  console.log('║    • GET  /api/health             - Health check       ║');
  console.log('╚════════════════════════════════════════════════════════╝');
});

module.exports = app;
