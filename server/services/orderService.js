import mongoose from "mongoose";

import User from "../models/User.js";
import Stock from "../models/Stock.js";
import Order from "../models/Order.js";
import Transaction from "../models/Transaction.js";
import Portfolio from "../models/Portfolio.js";
import Holding from "../models/Holding.js";
import { AppError } from "../middleware/errorMiddleware.js";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const ALLOWED_SORT_FIELDS = new Set(["createdAt", "updatedAt", "price", "quantity", "status", "action"]);
const ORDER_TYPES = new Set(["INTRADAY", "DELIVERY"]);

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const toPlain = (value) => {
  if (!value) return value;
  return typeof value.toObject === "function" ? value.toObject() : value;
};

const normalizePositiveInt = (value, fallback, max = Number.MAX_SAFE_INTEGER) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
};

const normalizeSort = (sortBy = "createdAt", sortOrder = "desc") => {
  const field = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : "createdAt";
  const direction = String(sortOrder).toLowerCase() === "asc" ? 1 : -1;
  return { [field]: direction };
};

const buildPagination = ({ page, limit, total }) => {
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

const normalizeOrderType = (value) => {
  const orderType = String(value || "DELIVERY").trim().toUpperCase();
  if (!ORDER_TYPES.has(orderType)) {
    throw new AppError("Invalid order type.", 400);
  }
  return orderType;
};

const normalizeQuantity = (value) => {
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new AppError("Quantity must be a positive integer.", 400);
  }
  return quantity;
};

const selectStock = "symbol name exchange currency marketCap sharesOutstanding description price change changePercent sector status";

const populateOrder = (query) =>
  query.populate({
    path: "stock",
    select: selectStock,
  });

const getOrderPrice = (stock) => toNumber(stock.price);

const resolveStock = async ({ stockId, symbol }, session) => {
  if (stockId) {
    if (!mongoose.isValidObjectId(stockId)) {
      throw new AppError("Invalid stock id.", 400);
    }
    const stock = await Stock.findById(stockId).session(session);
    if (!stock) {
      throw new AppError("Stock not found.", 404);
    }
    return stock;
  }

  if (symbol) {
    const normalizedSymbol = String(symbol).trim().toUpperCase();
    const stock = await Stock.findOne({ symbol: normalizedSymbol }).session(session);
    if (!stock) {
      throw new AppError("Stock not found.", 404);
    }
    return stock;
  }

  throw new AppError("Stock id or symbol is required.", 400);
};

const getOrCreatePortfolio = async (user, session) => {
  let portfolio = await Portfolio.findOne({ user: user._id }).session(session);
  if (portfolio) return portfolio;

  const [created] = await Portfolio.create(
    [
      {
        user: user._id,
        cashBalance: toNumber(user.balance),
        totalValue: toNumber(user.balance),
        investedValue: 0,
        marketValue: 0,
        realizedPnl: 0,
        unrealizedPnl: 0,
        dayPnl: 0,
        dayPnlPercent: 0,
        holdingsCount: 0,
        status: "ACTIVE",
      },
    ],
    { session },
  );

  portfolio = created;
  return portfolio;
};

const loadPortfolioSnapshot = async (portfolioId, session) => {
  const portfolio = await Portfolio.findById(portfolioId)
    .session(session)
    .populate({
      path: "user",
      select: "username email role balance status createdAt updatedAt",
    })
    .populate({
      path: "holdings",
      populate: {
        path: "stock",
        select: selectStock,
      },
    });

  if (!portfolio) {
    throw new AppError("Portfolio not found.", 404);
  }

  return toPlain(portfolio);
};

const recalculatePortfolioState = async (portfolioId, session, realizedDelta = 0) => {
  const portfolio = await Portfolio.findById(portfolioId).session(session);
  if (!portfolio) {
    throw new AppError("Portfolio not found.", 404);
  }

  const holdings = await Holding.find({ portfolio: portfolioId })
    .session(session)
    .populate({ path: "stock", select: "price" });

  let investedValue = 0;
  let marketValue = 0;
  let holdingsCount = 0;

  for (const holding of holdings) {
    const currentPrice = toNumber(holding.stock?.price);
    const quantity = toNumber(holding.quantity);
    const averageCost = toNumber(holding.averageCost);
    const costBasis = quantity * averageCost;
    const currentMarketValue = quantity * currentPrice;
    const unrealizedPnl = currentMarketValue - costBasis;
    const unrealizedPnlPercent = costBasis > 0 ? (unrealizedPnl / costBasis) * 100 : 0;

    holding.costBasis = costBasis;
    holding.marketValue = currentMarketValue;
    holding.lastPrice = currentPrice;
    holding.unrealizedPnl = unrealizedPnl;
    holding.dayPnl = unrealizedPnl;
    holding.dayPnlPercent = unrealizedPnlPercent;
    holding.lastUpdatedAt = new Date();
    holding.status = quantity > 0 ? "OPEN" : "CLOSED";

    if (quantity > 0) holdingsCount += 1;
    investedValue += costBasis;
    marketValue += currentMarketValue;

    await holding.save({ session });
  }

  portfolio.investedValue = investedValue;
  portfolio.marketValue = marketValue;
  portfolio.realizedPnl = toNumber(portfolio.realizedPnl) + realizedDelta;
  portfolio.unrealizedPnl = marketValue - investedValue;
  portfolio.dayPnl = portfolio.unrealizedPnl;
  portfolio.dayPnlPercent = investedValue > 0 ? (portfolio.dayPnl / investedValue) * 100 : 0;
  portfolio.totalValue = toNumber(portfolio.cashBalance) + marketValue;
  portfolio.holdingsCount = holdingsCount;
  portfolio.lastCalculatedAt = new Date();

  await portfolio.save({ session });

  return loadPortfolioSnapshot(portfolioId, session);
};

const createOrderRecord = async (payload, session) => {
  const [order] = await Order.create([payload], { session });
  return order;
};

const createTransactionRecord = async (payload, session) => {
  const [tx] = await Transaction.create([payload], { session });
  return tx;
};

const assertOwnership = (doc, userId) => {
  if (!doc) {
    throw new AppError("Order not found.", 404);
  }

  if (doc.user?.toString() !== userId.toString()) {
    throw new AppError("You can only access your own orders.", 403);
  }
};

const runTrade = async (work) => {
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => work(session));
  } finally {
    await session.endSession();
  }
};

const executeBuy = async (userId, body, session) => {
  const user = await User.findById(userId).session(session);
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const quantity = normalizeQuantity(body.quantity);
  const orderType = normalizeOrderType(body.orderType);
  const stock = await resolveStock({ stockId: body.stockId, symbol: body.symbol }, session);

  if (stock.status !== "ACTIVE") {
    throw new AppError("Selected stock is not available for trading.", 400);
  }

  const portfolio = await getOrCreatePortfolio(user, session);
  const price = getOrderPrice(stock);
  const grossAmount = price * quantity;

  if (toNumber(user.balance) < grossAmount) {
    throw new AppError("Insufficient balance.", 400);
  }

  const balanceBefore = toNumber(user.balance);
  const balanceAfter = balanceBefore - grossAmount;

  user.balance = balanceAfter;
  await user.save({ session });

  portfolio.cashBalance = balanceAfter;
  await portfolio.save({ session });

  const order = await createOrderRecord(
    {
      user: user._id,
      stock: stock._id,
      portfolio: portfolio._id,
      orderType,
      action: "BUY",
      side: "BUY",
      quantity,
      filledQuantity: quantity,
      price,
      status: "COMPLETED",
      timeInForce: "DAY",
      orderKind: "MARKET",
    },
    session,
  );

  const now = new Date();
  let holding = await Holding.findOne({ portfolio: portfolio._id, stock: stock._id }).session(session);
  const previousQuantity = holding ? toNumber(holding.quantity) : 0;
  const previousCostBasis = holding ? toNumber(holding.costBasis) : 0;
  const newQuantity = previousQuantity + quantity;
  const newCostBasis = previousCostBasis + grossAmount;
  const newAverageCost = newQuantity > 0 ? newCostBasis / newQuantity : 0;

  if (!holding) {
    [holding] = await Holding.create(
      [
        {
          portfolio: portfolio._id,
          stock: stock._id,
          quantity: newQuantity,
          averageCost: newAverageCost,
          costBasis: newCostBasis,
          marketValue: grossAmount,
          lastPrice: price,
          realizedPnl: 0,
          unrealizedPnl: 0,
          dayPnl: 0,
          dayPnlPercent: 0,
          firstAcquiredAt: now,
          lastUpdatedAt: now,
          status: "OPEN",
        },
      ],
      { session },
    );
  } else {
    holding.quantity = newQuantity;
    holding.averageCost = newAverageCost;
    holding.costBasis = newCostBasis;
    holding.marketValue = newQuantity * price;
    holding.lastPrice = price;
    holding.unrealizedPnl = holding.marketValue - holding.costBasis;
    holding.dayPnl = holding.unrealizedPnl;
    holding.dayPnlPercent = holding.costBasis > 0 ? (holding.unrealizedPnl / holding.costBasis) * 100 : 0;
    holding.lastUpdatedAt = now;
    holding.status = "OPEN";
    await holding.save({ session });
  }

  const transaction = await createTransactionRecord(
    {
      user: user._id,
      portfolio: portfolio._id,
      order: order._id,
      stock: stock._id,
      type: "BUY",
      amount: grossAmount,
      quantity,
      unitPrice: price,
      grossAmount,
      fees: 0,
      balanceBefore,
      balanceAfter,
      status: "COMPLETED",
      notes: `Bought ${quantity} ${stock.symbol} at ${price.toFixed(2)}`,
    },
    session,
  );

  const snapshot = await recalculatePortfolioState(portfolio._id, session, 0);

  return {
    order,
    transaction,
    portfolio: snapshot,
    holdings: snapshot.holdings,
    metrics: {
      totalInvestment: toNumber(snapshot.investedValue),
      currentPortfolioValue: toNumber(snapshot.marketValue),
      unrealizedProfitLoss: toNumber(snapshot.unrealizedPnl),
      overallPercentGainLoss:
        toNumber(snapshot.investedValue) > 0
          ? (toNumber(snapshot.unrealizedPnl) / toNumber(snapshot.investedValue)) * 100
          : 0,
    },
  };
};

const executeSell = async (userId, body, session) => {
  const user = await User.findById(userId).session(session);
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const quantity = normalizeQuantity(body.quantity);
  const orderType = normalizeOrderType(body.orderType);
  const stock = await resolveStock({ stockId: body.stockId, symbol: body.symbol }, session);

  if (stock.status !== "ACTIVE") {
    throw new AppError("Selected stock is not available for trading.", 400);
  }

  const portfolio = await getOrCreatePortfolio(user, session);
  const holding = await Holding.findOne({ portfolio: portfolio._id, stock: stock._id }).session(session);

  if (!holding || toNumber(holding.quantity) < quantity) {
    throw new AppError("Insufficient holdings to sell.", 400);
  }

  const price = getOrderPrice(stock);
  const grossAmount = price * quantity;
  const balanceBefore = toNumber(user.balance);
  const balanceAfter = balanceBefore + grossAmount;
  const averageCost = toNumber(holding.averageCost);
  const realizedDelta = (price - averageCost) * quantity;
  const remainingQuantity = toNumber(holding.quantity) - quantity;

  user.balance = balanceAfter;
  await user.save({ session });

  portfolio.cashBalance = balanceAfter;
  await portfolio.save({ session });

  const order = await createOrderRecord(
    {
      user: user._id,
      stock: stock._id,
      portfolio: portfolio._id,
      orderType,
      action: "SELL",
      side: "SELL",
      quantity,
      filledQuantity: quantity,
      price,
      status: "COMPLETED",
      timeInForce: "DAY",
      orderKind: "MARKET",
    },
    session,
  );

  const now = new Date();
  holding.quantity = remainingQuantity;
  holding.averageCost = averageCost;
  holding.costBasis = remainingQuantity * averageCost;
  holding.marketValue = remainingQuantity * price;
  holding.lastPrice = price;
  holding.realizedPnl = toNumber(holding.realizedPnl) + realizedDelta;
  holding.unrealizedPnl = holding.marketValue - holding.costBasis;
  holding.dayPnl = holding.unrealizedPnl;
  holding.dayPnlPercent = holding.costBasis > 0 ? (holding.unrealizedPnl / holding.costBasis) * 100 : 0;
  holding.lastUpdatedAt = now;
  holding.status = remainingQuantity > 0 ? "OPEN" : "CLOSED";

  await holding.save({ session });

  const transaction = await createTransactionRecord(
    {
      user: user._id,
      portfolio: portfolio._id,
      order: order._id,
      stock: stock._id,
      type: "SELL",
      amount: grossAmount,
      quantity,
      unitPrice: price,
      grossAmount,
      fees: 0,
      balanceBefore,
      balanceAfter,
      status: "COMPLETED",
      notes: `Sold ${quantity} ${stock.symbol} at ${price.toFixed(2)}`,
    },
    session,
  );

  const snapshot = await recalculatePortfolioState(portfolio._id, session, realizedDelta);

  return {
    order,
    transaction,
    portfolio: snapshot,
    holdings: snapshot.holdings,
    metrics: {
      totalInvestment: toNumber(snapshot.investedValue),
      currentPortfolioValue: toNumber(snapshot.marketValue),
      unrealizedProfitLoss: toNumber(snapshot.unrealizedPnl),
      overallPercentGainLoss:
        toNumber(snapshot.investedValue) > 0
          ? (toNumber(snapshot.unrealizedPnl) / toNumber(snapshot.investedValue)) * 100
          : 0,
    },
  };
};

export const orderService = {
  async createBuy(userId, body) {
    return runTrade((session) => executeBuy(userId, body, session));
  },

  async createSell(userId, body) {
    return runTrade((session) => executeSell(userId, body, session));
  },

  async listOrders(userId, query = {}) {
    const page = normalizePositiveInt(query.page, 1);
    const limit = normalizePositiveInt(query.limit, DEFAULT_LIMIT, MAX_LIMIT);
    const skip = (page - 1) * limit;
    const filter = { user: userId };

    if (query.status) filter.status = String(query.status).trim().toUpperCase();
    if (query.action) filter.action = String(query.action).trim().toUpperCase();

    const [orders, total] = await Promise.all([
      populateOrder(Order.find(filter))
        .sort(normalizeSort(query.sortBy, query.sortOrder))
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return {
      orders,
      pagination: buildPagination({ page, limit, total }),
    };
  },

  async getOrderById(id, userId) {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Invalid order id.", 400);
    }

    const order = await populateOrder(Order.findOne({ _id: id, user: userId })).lean();
    if (!order) {
      throw new AppError("Order not found.", 404);
    }

    return order;
  },

  async deleteOrder(id, userId) {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Invalid order id.", 400);
    }

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) {
      throw new AppError("Order not found.", 404);
    }

    if (order.status !== "PENDING") {
      throw new AppError("Only pending orders can be deleted.", 400);
    }

    await order.deleteOne();
    return { deletedId: order._id.toString() };
  },
};
