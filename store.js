const { v4: uuidv4 } = require('uuid');

// In-memory transaction store
let transactions = [];

// Initial demo data with variety of transactions
const demoData = [
  {
    id: uuidv4(),
    rawText: "Paid Rs. 250 to Zomato for food order",
    amount: -250,
    description: "Paid Rs. 250 to Zomato",
    category: "Food & Dining",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    isCashback: false,
    cashbackAmount: 0,
    merchant: "Zomato"
  },
  {
    id: uuidv4(),
    rawText: "Received Rs. 1,200 from Private Company Ltd",
    amount: 1200,
    description: "Received Rs. 1,200 from Private Company Ltd",
    category: "Salary",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    isCashback: false,
    cashbackAmount: 0,
    merchant: "Private Company Ltd"
  },
  {
    id: uuidv4(),
    rawText: "Uber trip charged Rs. 180 for ride to airport",
    amount: -180,
    description: "Uber trip charged Rs. 180",
    category: "Travel",
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    isCashback: false,
    cashbackAmount: 0,
    merchant: "Uber"
  },
  {
    id: uuidv4(),
    rawText: "Swiggy order delivered. Paid Rs. 420 for dinner",
    amount: -420,
    description: "Paid Rs. 420 to Swiggy",
    category: "Food & Dining",
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    isCashback: false,
    cashbackAmount: 0,
    merchant: "Swiggy"
  },
  {
    id: uuidv4(),
    rawText: "Cashback credited Rs. 50 from Amazon Pay rewards",
    amount: 50,
    description: "Cashback credited Rs. 50 from Amazon Pay",
    category: "Miscellaneous",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    isCashback: true,
    cashbackAmount: 50,
    merchant: "Amazon Pay"
  },
  {
    id: uuidv4(),
    rawText: "Paid Rs. 899 to Flipkart for electronics purchase",
    amount: -899,
    description: "Paid Rs. 899 to Flipkart",
    category: "Miscellaneous",
    timestamp: new Date(Date.now() - 3600000 * 30).toISOString(),
    isCashback: false,
    cashbackAmount: 0,
    merchant: "Flipkart"
  },
  {
    id: uuidv4(),
    rawText: "Ola ride completed. Fare Rs. 320 charged",
    amount: -320,
    description: "Ola ride fare Rs. 320",
    category: "Travel",
    timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
    isCashback: false,
    cashbackAmount: 0,
    merchant: "Ola"
  },
  {
    id: uuidv4(),
    rawText: "Salary credit Rs. 45,000 for June 2026",
    amount: 45000,
    description: "Salary credit Rs. 45,000",
    category: "Salary",
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    isCashback: false,
    cashbackAmount: 0,
    merchant: "Employer"
  },
  {
    id: uuidv4(),
    rawText: "Paid Rs. 150 to Dominos for pizza order",
    amount: -150,
    description: "Paid Rs. 150 to Dominos",
    category: "Food & Dining",
    timestamp: new Date(Date.now() - 3600000 * 56).toISOString(),
    isCashback: false,
    cashbackAmount: 0,
    merchant: "Dominos"
  },
  {
    id: uuidv4(),
    rawText: "BigBasket grocery order Rs. 1,250 paid",
    amount: -1250,
    description: "Paid Rs. 1,250 to BigBasket",
    category: "Miscellaneous",
    timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
    isCashback: false,
    cashbackAmount: 0,
    merchant: "BigBasket"
  }
];

transactions = demoData;

const getAllTransactions = () => {
  return [...transactions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const getTransactionById = (id) => {
  return transactions.find(t => t.id === id);
};

const addTransaction = (transaction) => {
  transactions.push(transaction);
  return transaction;
};

const updateTransaction = (id, updates) => {
  const index = transactions.findIndex(t => t.id === id);
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updates };
    return transactions[index];
  }
  return null;
};

const getCategorySummary = () => {
  const summary = {
    "Food & Dining": 0,
    "Travel": 0,
    "Salary": 0,
    "Miscellaneous": 0
  };

  transactions.forEach(t => {
    if (t.amount < 0 && summary[t.category] !== undefined) {
      summary[t.category] += Math.abs(t.amount);
    }
  });

  return summary;
};

const getFinancialMetrics = () => {
  let totalIncoming = 0;
  let totalOutgoing = 0;
  let totalCashback = 0;

  transactions.forEach(t => {
    if (t.amount > 0) {
      totalIncoming += t.amount;
    } else {
      totalOutgoing += Math.abs(t.amount);
    }
    if (t.isCashback) {
      totalCashback += t.cashbackAmount;
    }
  });

  return {
    totalIncoming,
    totalOutgoing,
    totalCashback,
    netSavings: totalIncoming - totalOutgoing
  };
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  addTransaction,
  updateTransaction,
  getCategorySummary,
  getFinancialMetrics,
  transactions
};
