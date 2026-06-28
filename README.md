# Backend - Bank Transaction Manager

Express.js REST API backend for transaction processing and analytics.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your configuration
nano .env

# Start development server
npm run dev
```

Server will run on `http://localhost:3000`

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **helmet** - Security headers
- **morgan** - HTTP logging
- **express-rate-limit** - Rate limiting

## 🔧 Scripts

```bash
npm start          # Start production server
npm run dev        # Start with nodemon (auto-reload)
npm test           # Run tests
npm run lint       # Run ESLint
npm run lint:fix   # Fix linting issues
npm run seed       # Seed database with sample data
npm run backup     # Backup MongoDB
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.js                 # Entry point
│   ├── routes/
│   │   ├── transactions.js     # Transaction endpoints
│   │   ├── metrics.js          # Metrics endpoints
│   │   ├── merchants.js        # Merchant endpoints
│   │   └── auth.js             # Auth endpoints
│   ├── middleware/
│   │   └── errorHandler.js     # Error handling
│   ├── models/
│   │   └── schemas.js          # Database schemas
│   └── config/
│       └── database.js         # DB connection
├── tests/
├── scripts/
├── .env.example
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Transactions
- `POST /api/transactions/parse` - Parse single transaction
- `POST /api/transactions/batch` - Batch process transactions
- `GET /api/transactions` - Get all transactions
- `PATCH /api/transactions/:id/category` - Update category

### Metrics
- `POST /api/metrics/calculate` - Calculate metrics
- `GET /api/metrics/:userId` - Get user metrics
- `POST /api/metrics/insights` - Generate insights

### Merchants
- `GET /api/merchants` - Get all merchants
- `GET /api/merchants/:category` - Get category merchants
- `POST /api/merchants/add` - Add merchant

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 🔐 Security

- JWT-based authentication
- Helmet for security headers
- CORS enabled
- Rate limiting on API endpoints
- Input validation and sanitization
- Password hashing with bcryptjs

## 📝 Environment Variables

```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bankmanager
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3001
RATE_LIMIT_MAX_REQUESTS=100
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh

# Update MONGODB_URI in .env
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Dependencies Issue
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)

## 📞 Support

For issues and questions, create a GitHub issue or contact support.

---

**Happy coding! 🚀**
