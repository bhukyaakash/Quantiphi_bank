const { v4: uuidv4 } = require('uuid');

// Merchant keyword mapping for auto-categorization
const MERCHANT_CATEGORIES = {
  // Food & Dining
  "zomato": "Food & Dining",
  "swiggy": "Food & Dining",
  "dominos": "Food & Dining",
  "pizza": "Food & Dining",
  "mcdonalds": "Food & Dining",
  "starbucks": "Food & Dining",
  "kfc": "Food & Dining",
  "burger king": "Food & Dining",
  "food": "Food & Dining",
  "restaurant": "Food & Dining",
  "dining": "Food & Dining",

  // Travel
  "uber": "Travel",
  "ola": "Travel",
  "rapido": "Travel",
  "redbus": "Travel",
  "makemytrip": "Travel",
  "goibibo": "Travel",
  "irctc": "Travel",
  "train": "Travel",
  "flight": "Travel",
  "cab": "Travel",
  "ride": "Travel",
  "trip": "Travel",

  // Salary / Income
  "salary": "Salary",
  "payroll": "Salary",
  "company ltd": "Salary",
  "private company": "Salary",
  "consulting": "Salary",
  "freelance": "Salary",
  "dividend": "Salary",

  // Miscellaneous (default for unmatched merchants)
  "amazon": "Miscellaneous",
  "flipkart": "Miscellaneous",
  "bigbasket": "Miscellaneous",
  "grofers": "Miscellaneous",
  "medical": "Miscellaneous",
  "pharmacy": "Miscellaneous",
  "insurance": "Miscellaneous",
  "bill": "Miscellaneous",
  "recharge": "Miscellaneous",
  "subscription": "Miscellaneous"
};

// Reward partners and cashback keywords
const REWARD_PARTNERS = [
  "amazon pay", "paytm", "phonepe", "google pay", "gpay",
  "cred", "mobikwik", "freecharge", "bhim", "upi rewards"
];

const CASHBACK_KEYWORDS = [
  "cashback", "reward", "points credited", "bonus", 
  "cash back", "reward points", "loyalty points"
];

/**
 * Extract amount from transaction text
 */
const extractAmount = (text) => {
  // Match patterns like "Rs. 250", "Rs 250", "INR 250", "₹250"
  const amountRegex = /(?:Rs\.?\s*|INR\s*|₹)\s*([\d,]+(?:\.\d{1,2})?)/i;
  const match = text.match(amountRegex);
  if (match) {
    const amountStr = match[1].replace(/,/g, '');
    return parseFloat(amountStr);
  }
  return null;
};

/**
 * Detect transaction direction (incoming/outgoing)
 */
const detectDirection = (text) => {
  const outgoingKeywords = ["paid", "debited", "charged", "deducted", "withdrawn", "spent", "purchase", "order"];
  const incomingKeywords = ["received", "credited", "cashback", "refund", "deposited", "salary"];

  const lowerText = text.toLowerCase();

  for (const keyword of outgoingKeywords) {
    if (lowerText.includes(keyword)) return "outgoing";
  }
  for (const keyword of incomingKeywords) {
    if (lowerText.includes(keyword)) return "incoming";
  }

  return "outgoing"; // default
};

/**
 * Auto-categorize based on merchant keywords
 */
const autoCategorize = (text) => {
  const lowerText = text.toLowerCase();

  for (const [merchant, category] of Object.entries(MERCHANT_CATEGORIES)) {
    if (lowerText.includes(merchant.toLowerCase())) {
      return category;
    }
  }

  return "Miscellaneous"; // default fallback
};

/**
 * Detect if transaction is a cashback/reward
 */
const detectCashback = (text) => {
  const lowerText = text.toLowerCase();

  // Check for cashback keywords
  const hasCashbackKeyword = CASHBACK_KEYWORDS.some(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );

  // Check for reward partners
  const hasRewardPartner = REWARD_PARTNERS.some(partner => 
    lowerText.includes(partner.toLowerCase())
  );

  return hasCashbackKeyword || hasRewardPartner;
};

/**
 * Calculate expected savings (cashback amount or 5% of transaction as simulated reward)
 */
const calculateExpectedSavings = (text, amount, isCashback) => {
  if (isCashback) {
    // If it's already a cashback transaction, use the actual amount
    const extractedAmount = extractAmount(text);
    if (extractedAmount && amount > 0) {
      return extractedAmount;
    }
    return Math.abs(amount) * 0.05; // 5% simulated
  }

  // Check if it's a reward partner transaction (not cashback but eligible)
  const lowerText = text.toLowerCase();
  const isRewardPartner = REWARD_PARTNERS.some(partner => 
    lowerText.includes(partner.toLowerCase())
  );

  if (isRewardPartner) {
    return Math.abs(amount) * 0.05; // 5% reward simulation
  }

  return 0;
};

/**
 * Extract merchant name from text
 */
const extractMerchant = (text) => {
  const lowerText = text.toLowerCase();

  for (const merchant of Object.keys(MERCHANT_CATEGORIES)) {
    if (lowerText.includes(merchant.toLowerCase())) {
      return merchant.charAt(0).toUpperCase() + merchant.slice(1);
    }
  }

  // Try to extract after "to" or "from"
  const toMatch = text.match(/(?:to|from)\s+([A-Z][a-zA-Z\s]+?)(?:\s+(?:for|on|via|using|\d))/i);
  if (toMatch) return toMatch[1].trim();

  return "Unknown";
};

/**
 * Generate clean description from raw text
 */
const generateDescription = (text, amount, direction) => {
  const merchant = extractMerchant(text);
  const absAmount = Math.abs(amount);

  if (direction === "incoming") {
    return `Received Rs. ${absAmount.toLocaleString()} from ${merchant}`;
  } else {
    return `Paid Rs. ${absAmount.toLocaleString()} to ${merchant}`;
  }
};

/**
 * Main parser function - processes raw transaction text
 */
const parseTransaction = (rawText) => {
  const amount = extractAmount(rawText);
  if (!amount) {
    throw new Error("Could not extract amount from transaction text");
  }

  const direction = detectDirection(rawText);
  const signedAmount = direction === "outgoing" ? -amount : amount;
  const category = autoCategorize(rawText);
  const isCashback = detectCashback(rawText);
  const cashbackAmount = calculateExpectedSavings(rawText, signedAmount, isCashback);
  const merchant = extractMerchant(rawText);
  const description = generateDescription(rawText, signedAmount, direction);

  return {
    id: uuidv4(),
    rawText,
    amount: signedAmount,
    description,
    category,
    timestamp: new Date().toISOString(),
    isCashback,
    cashbackAmount,
    merchant,
    direction
  };
};

module.exports = {
  parseTransaction,
  extractAmount,
  autoCategorize,
  detectCashback,
  calculateExpectedSavings,
  MERCHANT_CATEGORIES,
  REWARD_PARTNERS
};
