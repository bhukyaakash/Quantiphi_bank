# Bank Transaction UPI Summary & Categorization

A complete automated money manager application that parses unstructured transaction alerts, categorizes transactions, and visualizes spending habits.

## Project Structure

```
bank-transaction-manager/
├── backend/
│   ├── data/
│   │   └── store.js              # In-memory data store with 10 demo transactions
│   ├── routes/
│   │   └── transactions.js         # REST API endpoints
│   ├── services/
│   │   ├── parser.js             # Transaction text parser & auto-categorizer
│   │   └── categorizer.js        # Category management utilities
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── styles/
│   │   └── main.css              # Complete dark theme styling
│   ├── services/
│   │   └── api.js                # API communication layer
│   ├── components/
│   │   ├── AnalyticsBlock.js     # Progress bar analytics
│   │   ├── TransactionCard.js      # Transaction card with dropdown
│   │   └── TransactionForm.js      # Input form handler
│   ├── app.js                    # Main application orchestrator
│   └── index.html                # Single page application
└── README.md
```

## Quick Start

### Backend Setup
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
# Option 1: Python
cd frontend && python -m http.server 3000

# Option 2: Node.js (install serve globally)
npm install -g serve
cd frontend && serve -p 3000

# Option 3: VS Code Live Server extension
# Right-click index.html -> Open with Live Server
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/transactions | List all transactions |
| GET | /api/transactions/summary | Get analytics data |
| POST | /api/transactions | Parse & create from raw text |
| PUT | /api/transactions/:id/category | Update category |
| GET | /api/health | Health check |

## Features

### Frontend
- **Transaction Stream**: Chronological scrolling feed with animated cards
- **Visual Analytics**: Categorized progress bars with color-coded fills
- **Interactive Category Selector**: Dropdown to manually override auto-tags
- **Cashback Detection**: Green "Expected Savings" rows for reward-eligible transactions

### Backend
- **Automated Keyword Parser**: Detects merchants (Zomato, Swiggy, Uber, etc.) and auto-assigns categories
- **Cumulative Metric Reducer**: Separates incoming/outgoing, calculates category sums
- **Reward Partner Detection**: Identifies Cashback keywords and known reward partners
- **Simulated Savings Injection**: Calculates 5% expected rewards for eligible transactions

## Supported Merchant Keywords

| Category | Keywords |
|----------|----------|
| Food & Dining | Zomato, Swiggy, Dominos, McDonalds, Starbucks, KFC, Burger King, food, restaurant |
| Travel | Uber, Ola, Rapido, RedBus, MakeMyTrip, Goibibo, IRCTC, train, flight, cab |
| Salary | salary, payroll, company ltd, consulting, freelance, dividend |
| Miscellaneous | Amazon, Flipkart, BigBasket, medical, insurance, bill, recharge |

## Cashback & Rewards

The system detects:
- **Cashback keywords**: "cashback", "reward", "points credited", "bonus"
- **Reward partners**: Amazon Pay, Paytm, PhonePe, Google Pay, CRED, MobiKwik

For reward partner transactions (non-cashback), a simulated **5% Expected Savings** row appears in green.
