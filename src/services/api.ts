import axiosInstance from "./axiosInstance";

// ---------- Auth ----------
export const authApi = {
  register: (data: { username: string; email: string; password: string; userType?: string }) =>
    axiosInstance.post("/users/register", data),
  login: (data: { email: string; password: string }) =>
    axiosInstance.post("/users/login", data),
  profile: () => axiosInstance.get("/users/profile"),
  updateProfile: (data: Record<string, unknown>) =>
    axiosInstance.put("/users/profile", data),
};

// ---------- Stocks ----------
export const stocksApi = {
  list: () => axiosInstance.get("/stocks"),
  search: (q: string) => axiosInstance.get(`/stocks/search?q=${encodeURIComponent(q)}`),
  detail: (symbol: string) => axiosInstance.get(`/stocks/${symbol}`),
  history: (symbol: string) => axiosInstance.get(`/stocks/${symbol}/history`),
  trending: () => axiosInstance.get("/stocks/trending"),
  gainers: () => axiosInstance.get("/stocks/gainers"),
  losers: () => axiosInstance.get("/stocks/losers"),
};

// ---------- Orders ----------
export const ordersApi = {
  buy: (data: { symbol: string; quantity: number; price: number; orderType: string }) =>
    axiosInstance.post("/orders/buy", data),
  sell: (data: { symbol: string; quantity: number; price: number; orderType: string }) =>
    axiosInstance.post("/orders/sell", data),
  list: () => axiosInstance.get("/orders"),
};

// ---------- Portfolio ----------
export const portfolioApi = {
  get: () => axiosInstance.get("/portfolio"),
};

// ---------- Transactions ----------
export const transactionsApi = {
  list: () => axiosInstance.get("/transactions"),
  deposit: (amount: number) => axiosInstance.post("/transactions/deposit", { amount }),
  withdraw: (amount: number) => axiosInstance.post("/transactions/withdraw", { amount }),
};

// ---------- Admin ----------
export const adminApi = {
  users: () => axiosInstance.get("/admin/users"),
  orders: () => axiosInstance.get("/admin/orders"),
  transactions: () => axiosInstance.get("/admin/transactions"),
  stats: () => axiosInstance.get("/admin/stats"),
};
