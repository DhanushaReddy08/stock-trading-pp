export type Stock = {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  sector?: string;
};

export const DUMMY_STOCKS: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", price: 192.34, change: 2.14, changePercent: 1.12, sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corp.", exchange: "NASDAQ", price: 421.55, change: 3.92, changePercent: 0.94, sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ", price: 178.21, change: -1.05, changePercent: -0.59, sector: "Communication" },
  { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ", price: 189.62, change: 0.84, changePercent: 0.45, sector: "Consumer" },
  { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", price: 248.17, change: -4.32, changePercent: -1.71, sector: "Automotive" },
  { symbol: "NVDA", name: "NVIDIA Corp.", exchange: "NASDAQ", price: 132.91, change: 5.67, changePercent: 4.46, sector: "Semiconductor" },
  { symbol: "META", name: "Meta Platforms Inc.", exchange: "NASDAQ", price: 512.04, change: 6.21, changePercent: 1.23, sector: "Communication" },
  { symbol: "NFLX", name: "Netflix Inc.", exchange: "NASDAQ", price: 678.45, change: -2.18, changePercent: -0.32, sector: "Entertainment" },
  { symbol: "JPM", name: "JPMorgan Chase", exchange: "NYSE", price: 215.74, change: 1.06, changePercent: 0.49, sector: "Finance" },
  { symbol: "V", name: "Visa Inc.", exchange: "NYSE", price: 281.32, change: 0.62, changePercent: 0.22, sector: "Finance" },
  { symbol: "DIS", name: "Walt Disney Co.", exchange: "NYSE", price: 102.45, change: -0.81, changePercent: -0.78, sector: "Entertainment" },
  { symbol: "BA", name: "Boeing Co.", exchange: "NYSE", price: 184.21, change: 2.45, changePercent: 1.35, sector: "Industrial" },
];

export const generateHistory = (base: number, points = 60) => {
  const data: { date: string; price: number }[] = [];
  let p = base * 0.85;
  for (let i = points; i >= 0; i--) {
    p = p + (Math.random() - 0.48) * (base * 0.025);
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({ date: d.toISOString().slice(5, 10), price: Math.max(1, +p.toFixed(2)) });
  }
  data[data.length - 1].price = base;
  return data;
};

export type Holding = {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
};

export const DUMMY_HOLDINGS: Holding[] = [
  { symbol: "AAPL", name: "Apple Inc.", quantity: 12, avgPrice: 178.5, currentPrice: 192.34 },
  { symbol: "NVDA", name: "NVIDIA Corp.", quantity: 30, avgPrice: 110.2, currentPrice: 132.91 },
  { symbol: "TSLA", name: "Tesla Inc.", quantity: 8, avgPrice: 265.0, currentPrice: 248.17 },
  { symbol: "MSFT", name: "Microsoft Corp.", quantity: 5, avgPrice: 410.0, currentPrice: 421.55 },
];

export type Transaction = {
  id: string;
  date: string;
  symbol: string;
  action: "BUY" | "SELL";
  quantity: number;
  price: number;
  status: "COMPLETED" | "PENDING" | "FAILED";
};

export const DUMMY_TRANSACTIONS: Transaction[] = [
  { id: "T-1001", date: "2025-06-20", symbol: "AAPL", action: "BUY", quantity: 5, price: 188.4, status: "COMPLETED" },
  { id: "T-1002", date: "2025-06-21", symbol: "NVDA", action: "BUY", quantity: 10, price: 128.7, status: "COMPLETED" },
  { id: "T-1003", date: "2025-06-22", symbol: "TSLA", action: "SELL", quantity: 2, price: 252.1, status: "COMPLETED" },
  { id: "T-1004", date: "2025-06-23", symbol: "MSFT", action: "BUY", quantity: 5, price: 410.0, status: "COMPLETED" },
  { id: "T-1005", date: "2025-06-24", symbol: "AAPL", action: "BUY", quantity: 7, price: 190.2, status: "PENDING" },
];

export type Order = {
  id: string;
  user: string;
  symbol: string;
  orderType: "INTRADAY" | "DELIVERY";
  action: "BUY" | "SELL";
  quantity: number;
  price: number;
  status: "COMPLETED" | "PENDING" | "CANCELLED";
};

export const DUMMY_ORDERS: Order[] = [
  { id: "O-501", user: "alice", symbol: "AAPL", orderType: "DELIVERY", action: "BUY", quantity: 5, price: 188.4, status: "COMPLETED" },
  { id: "O-502", user: "bob", symbol: "TSLA", orderType: "INTRADAY", action: "SELL", quantity: 2, price: 252.1, status: "COMPLETED" },
  { id: "O-503", user: "carol", symbol: "NVDA", orderType: "DELIVERY", action: "BUY", quantity: 10, price: 128.7, status: "PENDING" },
  { id: "O-504", user: "david", symbol: "MSFT", orderType: "DELIVERY", action: "BUY", quantity: 3, price: 410.0, status: "COMPLETED" },
];

export type AdminUser = {
  id: string;
  username: string;
  email: string;
  balance: number;
  status: "ACTIVE" | "SUSPENDED";
};

export const DUMMY_USERS: AdminUser[] = [
  { id: "U-101", username: "alice", email: "alice@example.com", balance: 12500, status: "ACTIVE" },
  { id: "U-102", username: "bob", email: "bob@example.com", balance: 8420, status: "ACTIVE" },
  { id: "U-103", username: "carol", email: "carol@example.com", balance: 540, status: "SUSPENDED" },
  { id: "U-104", username: "david", email: "david@example.com", balance: 22100, status: "ACTIVE" },
];
