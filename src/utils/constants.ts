export const API_BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  "/api";

export const TOKEN_KEY = "sb_stocks_token";
export const USER_KEY = "sb_stocks_user";

export const APP_NAME = "SB Stocks";
export const APP_TAGLINE =
  "Practice stock trading with virtual money using live US market data.";

export const ORDER_TYPES = [
  { value: "INTRADAY", label: "Intraday" },
  { value: "DELIVERY", label: "Delivery" },
] as const;

export const TXN_FILTERS = ["ALL", "BUY", "SELL"] as const;
