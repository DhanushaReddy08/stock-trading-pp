# 📈 SB Stocks - Full Stack Stock Trading Platform

![React](https://img.shields.io/badge/React-19-blue)
![NodeJS](https://img.shields.io/badge/Node.js-22-green)
![Express](https://img.shields.io/badge/Express-5-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![JWT](https://img.shields.io/badge/JWT-Authentication-red)
![License](https://img.shields.io/badge/License-MIT-blue)
      
       https://sb-stocks-app.vercel.app/
---

# 📖 Overview

SB Stocks is a full-stack MERN web application that simulates a real-world stock trading platform.

Users can:

- Register/Login securely
- Buy & Sell Stocks
- Track Portfolio
- View Dashboard Analytics
- Monitor Transactions
- Search Stocks
- View Market Data

The project follows modern MERN architecture using React, Express, MongoDB Atlas, JWT Authentication, MVC Architecture, and REST APIs.

---

# ✨ Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Password Encryption (bcrypt)
- Protected Routes

---

## Dashboard

- Portfolio Overview
- Current Balance
- Total Investment
- Profit/Loss
- Recent Transactions
- Recent Orders
- Trending Stocks
- Market Overview

---

## Stock Module

- Stock Listing
- Search Stocks
- Pagination
- Sorting
- Filtering
- Sector Filter
- Market Cap Filter
- Admin CRUD Operations

---

## Portfolio

- Holdings
- Portfolio Summary
- Investment Value
- Profit/Loss
- Auto Portfolio Creation

---

## Trading

- Buy Stocks
- Sell Stocks
- Order Management
- Transaction History
- Ownership Validation
- Balance Validation

---

## Backend

- MVC Architecture
- REST APIs
- MongoDB Atlas
- Mongoose ODM
- JWT Authentication
- Express Middleware
- Centralized Error Handling

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- TanStack Router
- Context API
- Axios
- CSS

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- Morgan
- Helmet
- CORS

---

# 📂 Project Structure

```
StockTradingApp
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   └── server.js
│
├── src
│   ├── components
│   ├── context
│   ├── hooks
│   ├── routes
│   ├── services
│   └── utils
│
├── README.md
├── package.json
└── vite.config.ts
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/StockTradingApp.git
```

---

## Install Frontend

```bash
npm install
```

---

## Install Backend

```bash
cd server

npm install
```

---

## Environment Variables

Create

```
server/.env
```

Example

```env
PORT=5000

NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:8080
```

---

## Start Backend

```bash
cd server

npm run dev
```

---

## Start Frontend

```bash
npm run dev
```

---

# 📸 Screenshots

## Landing Page

(Add Screenshot)

---

## Login

(Add Screenshot)

---

## Register

(Add Screenshot)

---

## Dashboard

(Add Screenshot)

---

## Portfolio

(Add Screenshot)

---

## Stocks

(Add Screenshot)

---

## Transactions

(Add Screenshot)

---

# 📡 API Endpoints

## Authentication

```
POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout
```

---

## Stocks

```
GET /api/stocks

GET /api/stocks/:id

GET /api/stocks/search

POST /api/stocks

PUT /api/stocks/:id

DELETE /api/stocks/:id
```

---

## Portfolio

```
GET /api/portfolio
```

---

## Orders

```
POST /api/orders/buy

POST /api/orders/sell

GET /api/orders

GET /api/orders/:id

DELETE /api/orders/:id
```

---

## Dashboard

```
GET /api/dashboard
```

---

# 🔒 Security

- JWT Authentication
- Password Hashing
- Protected Routes
- Role Based Authorization
- Input Validation
- MongoDB Validation

---

# 🎯 Future Scope

- Watchlist
- Notifications
- Live Stock Prices
- AI Stock Prediction
- Email Notifications
- Dark Mode

---

# 👨‍💻 Author

**Bhuvanesh Jujare**

B.Tech Computer Science Engineering

Annamacharya Institute of Technology & Sciences - TIRUPATI

---

# 📄 License

This project is licensed under the MIT License.
