import mongoose from "mongoose";
import Portfolio from "../models/Portfolio.js";
import Holding from "../models/Holding.js";
import Order from "../models/Order.js";
import Transaction from "../models/Transaction.js";
import Stock from "../models/Stock.js";
import { AppError } from "../middleware/errorMiddleware.js";

const DEFAULT_LIMIT = 10;
const STARTING_BALANCE = 100000;
const HOLDINGS_LOOKUP = {
  from: "stocks",
  localField: "stock",
  foreignField: "_id",
  as: "stock",
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const toPlain = (value) => {
  if (!value) return value;
  return typeof value.toObject === "function" ? value.toObject() : value;
};

const ensurePortfolio = async (user) => {
  const portfolio = await Portfolio.findOneAndUpdate(
    { user: user._id },
    {
      $setOnInsert: {
        user: user._id,
        cashBalance: toNumber(user.balance),
        investedValue: 0,
        marketValue: 0,
        totalValue: toNumber(user.balance),
        realizedPnl: 0,
        unrealizedPnl: 0,
        dayPnl: 0,
        dayPnlPercent: 0,
        holdingsCount: 0,
        status: "ACTIVE",
        lastCalculatedAt: new Date(),
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  ).lean();

  return portfolio;
};

const buildHoldingsAggregation = (portfolioId) => [
  { $match: { portfolio: new mongoose.Types.ObjectId(portfolioId) } },
  { $lookup: HOLDINGS_LOOKUP },
  { $unwind: { path: "$stock", preserveNullAndEmptyArrays: false } },
  {
    $addFields: {
      currentPrice: "$stock.price",
      marketValue: { $multiply: ["$quantity", "$stock.price"] },
      costBasis: { $multiply: ["$quantity", "$averageCost"] },
    },
  },
  {
    $addFields: {
      unrealizedPnl: { $subtract: ["$marketValue", "$costBasis"] },
      unrealizedPnlPercent: {
        $cond: [
          { $gt: ["$costBasis", 0] },
          { $multiply: [{ $divide: [{ $subtract: ["$marketValue", "$costBasis"] }, "$costBasis"] }, 100] },
          0,
        ],
      },
    },
  },
  {
    $project: {
      _id: 1,
      portfolio: 1,
      stock: {
        _id: "$stock._id",
        symbol: "$stock.symbol",
        name: "$stock.name",
        exchange: "$stock.exchange",
        price: "$stock.price",
        change: "$stock.change",
        changePercent: "$stock.changePercent",
        sector: "$stock.sector",
        marketCap: "$stock.marketCap",
      },
      quantity: 1,
      averageCost: 1,
      costBasis: 1,
      currentPrice: 1,
      marketValue: 1,
      unrealizedPnl: 1,
      unrealizedPnlPercent: 1,
      realizedPnl: 1,
      dayPnl: 1,
      dayPnlPercent: 1,
      lastUpdatedAt: 1,
      firstAcquiredAt: 1,
    },
  },
  { $sort: { marketValue: -1, quantity: -1 } },
];

const buildRecentTxPipeline = (userId, portfolioId) => [
  {
    $match: {
      user: new mongoose.Types.ObjectId(userId),
      portfolio: new mongoose.Types.ObjectId(portfolioId),
    },
  },
  { $sort: { createdAt: -1 } },
  { $limit: DEFAULT_LIMIT },
  {
    $lookup: {
      from: "stocks",
      localField: "stock",
      foreignField: "_id",
      as: "stock",
    },
  },
  { $unwind: { path: "$stock", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      _id: 1,
      type: 1,
      amount: 1,
      quantity: 1,
      unitPrice: 1,
      grossAmount: 1,
      fees: 1,
      balanceBefore: 1,
      balanceAfter: 1,
      status: 1,
      notes: 1,
      createdAt: 1,
      stock: {
        _id: "$stock._id",
        symbol: "$stock.symbol",
        name: "$stock.name",
        price: "$stock.price",
        exchange: "$stock.exchange",
      },
    },
  },
];

const buildRecentOrdersPipeline = (userId, portfolioId) => [
  {
    $match: {
      user: new mongoose.Types.ObjectId(userId),
      portfolio: new mongoose.Types.ObjectId(portfolioId),
    },
  },
  { $sort: { createdAt: -1 } },
  { $limit: DEFAULT_LIMIT },
  {
    $lookup: {
      from: "stocks",
      localField: "stock",
      foreignField: "_id",
      as: "stock",
    },
  },
  { $unwind: { path: "$stock", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      _id: 1,
      action: 1,
      side: 1,
      orderType: 1,
      orderKind: 1,
      quantity: 1,
      filledQuantity: 1,
      price: 1,
      status: 1,
      timeInForce: 1,
      createdAt: 1,
      stock: {
        _id: "$stock._id",
        symbol: "$stock.symbol",
        name: "$stock.name",
        price: "$stock.price",
        exchange: "$stock.exchange",
      },
    },
  },
];

const buildMarketOverview = async () => {
  const [stockStats] = await Stock.aggregate([
    {
      $group: {
        _id: null,
        totalStocks: { $sum: 1 },
        activeStocks: {
          $sum: { $cond: [{ $eq: ["$status", "ACTIVE"] }, 1, 0] },
        },
        totalMarketCap: { $sum: "$marketCap" },
        activeMarketCap: {
          $sum: { $cond: [{ $eq: ["$status", "ACTIVE"] }, "$marketCap", 0] },
        },
      },
    },
  ]);

  return {
    totalStocks: stockStats?.totalStocks ?? 0,
    activeStocks: stockStats?.activeStocks ?? 0,
    marketCapSummary: {
      totalMarketCap: stockStats?.totalMarketCap ?? 0,
      activeMarketCap: stockStats?.activeMarketCap ?? 0,
    },
  };
};

const buildTrendingStocks = async () => {
  const [gainers, losers, mostTraded] = await Promise.all([
    Stock.aggregate([
      { $match: { status: "ACTIVE" } },
      { $sort: { changePercent: -1, marketCap: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          symbol: 1,
          name: 1,
          exchange: 1,
          price: 1,
          change: 1,
          changePercent: 1,
          sector: 1,
          marketCap: 1,
        },
      },
    ]),
    Stock.aggregate([
      { $match: { status: "ACTIVE" } },
      { $sort: { changePercent: 1, marketCap: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          symbol: 1,
          name: 1,
          exchange: 1,
          price: 1,
          change: 1,
          changePercent: 1,
          sector: 1,
          marketCap: 1,
        },
      },
    ]),
    Order.aggregate([
      {
        $match: {
          status: "COMPLETED",
        },
      },
      {
        $group: {
          _id: "$stock",
          tradeCount: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalValue: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
      { $sort: { totalQuantity: -1, totalValue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "stocks",
          localField: "_id",
          foreignField: "_id",
          as: "stock",
        },
      },
      { $unwind: { path: "$stock", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          stock: {
            _id: "$stock._id",
            symbol: "$stock.symbol",
            name: "$stock.name",
            exchange: "$stock.exchange",
            price: "$stock.price",
            change: "$stock.change",
            changePercent: "$stock.changePercent",
            sector: "$stock.sector",
          },
          tradeCount: 1,
          totalQuantity: 1,
          totalValue: 1,
        },
      },
    ]),
  ]);

  return { gainers, losers, mostTraded };
};

const buildDashboardStatistics = async (userId) => {
  const [stats] = await Order.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        buyOrders: { $sum: { $cond: [{ $eq: ["$action", "BUY"] }, 1, 0] } },
        sellOrders: { $sum: { $cond: [{ $eq: ["$action", "SELL"] }, 1, 0] } },
        completedOrders: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] } },
        pendingOrders: { $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] } },
      },
    },
  ]);

  return {
    totalOrders: stats?.totalOrders ?? 0,
    buyOrders: stats?.buyOrders ?? 0,
    sellOrders: stats?.sellOrders ?? 0,
    completedOrders: stats?.completedOrders ?? 0,
    pendingOrders: stats?.pendingOrders ?? 0,
  };
};

export const dashboardService = {
  async getDashboard(user) {
    if (!user?._id) {
      throw new AppError("Not authorized.", 401);
    }

    const portfolio = await ensurePortfolio(user);
    const portfolioId = portfolio._id;

    const [holdings, transactions, orders, marketOverview, trendingStocks, orderStats] =
      await Promise.all([
        Holding.aggregate(buildHoldingsAggregation(portfolioId)),
        Transaction.aggregate(buildRecentTxPipeline(user._id, portfolioId)),
        Order.aggregate(buildRecentOrdersPipeline(user._id, portfolioId)),
        buildMarketOverview(),
        buildTrendingStocks(),
        buildDashboardStatistics(user._id),
      ]);

    const totalInvestment = holdings.reduce((sum, holding) => sum + toNumber(holding.costBasis), 0);
    const currentPortfolioValue = holdings.reduce((sum, holding) => sum + toNumber(holding.marketValue), 0);
    const totalCash = toNumber(portfolio.cashBalance);
    const todaysProfitLoss = toNumber(portfolio.dayPnl);
    const overallProfitLoss = currentPortfolioValue - totalInvestment;
    const percentageReturn = totalInvestment > 0 ? (overallProfitLoss / totalInvestment) * 100 : 0;
    const totalReturn = toNumber(portfolio.totalValue) - STARTING_BALANCE;
    const roi = STARTING_BALANCE > 0 ? (totalReturn / STARTING_BALANCE) * 100 : 0;
    const winningHoldings = holdings.filter((holding) => toNumber(holding.unrealizedPnl) > 0).length;
    const winRate = holdings.length > 0 ? (winningHoldings / holdings.length) * 100 : 0;
    const averageHoldingValue = holdings.length > 0 ? currentPortfolioValue / holdings.length : 0;

    const allocationBase = currentPortfolioValue > 0 ? currentPortfolioValue : totalInvestment;
    const portfolioAllocation = holdings.map((holding) => ({
      ...holding,
      percentage: allocationBase > 0 ? (toNumber(holding.marketValue) / allocationBase) * 100 : 0,
    }));

    return {
      portfolioSummary: {
        availableCash: totalCash,
        totalInvestment,
        currentPortfolioValue,
        todaysProfitLoss,
        overallProfitLoss,
        percentageReturn,
      },
      portfolioAllocation,
      recentTransactions: transactions.map(toPlain),
      recentOrders: orders.map(toPlain),
      topHoldings: holdings.slice(0, 5).map(toPlain),
      marketOverview,
      trendingStocks,
      dashboardStatistics: orderStats,
      performanceMetrics: {
        totalReturn,
        roi,
        winRate,
        averageHoldingValue,
      },
    };
  },
};
