import mongoose from "mongoose";
import Portfolio from "../models/Portfolio.js";
import Holding from "../models/Holding.js";
import { AppError } from "../middleware/errorMiddleware.js";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const toPlain = (value) => {
  if (!value) return value;
  return typeof value.toObject === "function" ? value.toObject() : value;
};

const parseNumber = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new AppError(`${fieldName} must be a valid number.`, 400);
  }

  return parsed;
};

const toId = (value) => {
  if (!mongoose.isValidObjectId(value)) {
    throw new AppError("Invalid portfolio id.", 400);
  }
  return value;
};

const buildMetrics = (portfolioDoc) => {
  const holdings = portfolioDoc.holdings || [];

  const totalInvestment = holdings.reduce((sum, holding) => sum + toNumber(holding.costBasis), 0);
  const currentPortfolioValue = holdings.reduce(
    (sum, holding) => sum + toNumber(holding.marketValue),
    0,
  );
  const unrealizedProfitLoss = currentPortfolioValue - totalInvestment;
  const overallPercentGainLoss = totalInvestment > 0 ? (unrealizedProfitLoss / totalInvestment) * 100 : 0;
  const totalAccountValue = toNumber(portfolioDoc.cashBalance) + currentPortfolioValue;
  const totalReturn = totalAccountValue - totalInvestment;

  return {
    totalInvestment,
    currentPortfolioValue,
    unrealizedProfitLoss,
    overallPercentGainLoss,
    totalAccountValue,
    totalReturn,
  };
};

const populatePortfolio = async (portfolioQuery) =>
  portfolioQuery
    .populate({
      path: "user",
      select: "username email role balance status createdAt updatedAt",
    })
    .populate({
      path: "holdings",
      populate: {
        path: "stock",
        select:
          "symbol name exchange currency marketCap sharesOutstanding description price change changePercent sector status createdAt updatedAt",
      },
    });

const computeHoldingSnapshot = (holding) => {
  const currentPrice = toNumber(holding.stock?.price);
  const quantity = toNumber(holding.quantity);
  const averageCost = toNumber(holding.averageCost);
  const costBasis = quantity * averageCost;
  const marketValue = quantity * currentPrice;
  const unrealizedPnl = marketValue - costBasis;
  const unrealizedPnlPercent = costBasis > 0 ? (unrealizedPnl / costBasis) * 100 : 0;

  return {
    ...toPlain(holding),
    costBasis,
    marketValue,
    unrealizedPnl,
    unrealizedPnlPercent,
    currentPrice,
  };
};

const ensureOwnership = (portfolio, userId) => {
  if (!portfolio) {
    throw new AppError("Portfolio not found.", 404);
  }

  if (portfolio.user?._id?.toString() !== userId.toString()) {
    throw new AppError("You can only access your own portfolio.", 403);
  }
};

export const portfolioService = {
  async getOrCreateForUser(userId) {
    const portfolio = await populatePortfolio(
      Portfolio.findOne({ user: userId }).sort({ createdAt: -1 }),
    );

    if (portfolio) {
      const holdings = (portfolio.holdings || []).map(computeHoldingSnapshot);
      const portfolioObject = toPlain(portfolio);
      const metrics = buildMetrics({ ...portfolioObject, holdings });
      return { portfolio: portfolioObject, holdings, metrics };
    }

    const created = await Portfolio.create({ user: userId });
    const populated = await populatePortfolio(Portfolio.findById(created._id));
    const holdings = [];
    const portfolioObject = toPlain(populated);
    const metrics = buildMetrics({ ...portfolioObject, holdings });
    return { portfolio: portfolioObject, holdings, metrics };
  },

  async getById(id, userId) {
    const portfolio = await populatePortfolio(Portfolio.findById(toId(id)));

    if (!portfolio) {
      throw new AppError("Portfolio not found.", 404);
    }

    ensureOwnership(portfolio, userId);

    const holdings = (portfolio.holdings || []).map(computeHoldingSnapshot);
    const portfolioObject = toPlain(portfolio);
    const metrics = buildMetrics({ ...portfolioObject, holdings });

    return { portfolio: portfolioObject, holdings, metrics };
  },

  async createPortfolio(userId, payload = {}) {
    const existing = await Portfolio.findOne({ user: userId });
    if (existing) {
      throw new AppError("Portfolio already exists for this user.", 409);
    }

    const cashBalance =
      payload.cashBalance === undefined ? 100000 : parseNumber(payload.cashBalance, "cashBalance");
    const status = payload.status === undefined ? "ACTIVE" : String(payload.status).trim().toUpperCase();

    const portfolio = await Portfolio.create({
      user: userId,
      cashBalance,
      status,
    });

    const populated = await populatePortfolio(Portfolio.findById(portfolio._id));
    const holdings = [];
    const portfolioObject = toPlain(populated);
    const metrics = buildMetrics({ ...portfolioObject, holdings });

    return { portfolio: portfolioObject, holdings, metrics };
  },

  async updatePortfolio(id, userId, payload = {}) {
    const portfolio = await Portfolio.findById(toId(id));

    if (!portfolio) {
      throw new AppError("Portfolio not found.", 404);
    }

    ensureOwnership(await Portfolio.findById(portfolio._id).populate("user"), userId);

    const updatable = {};
    if (payload.cashBalance !== undefined) updatable.cashBalance = parseNumber(payload.cashBalance, "cashBalance");
    if (payload.status !== undefined) updatable.status = String(payload.status).trim().toUpperCase();
    if (payload.realizedPnl !== undefined) updatable.realizedPnl = parseNumber(payload.realizedPnl, "realizedPnl");
    if (payload.unrealizedPnl !== undefined) updatable.unrealizedPnl = parseNumber(payload.unrealizedPnl, "unrealizedPnl");
    if (payload.dayPnl !== undefined) updatable.dayPnl = parseNumber(payload.dayPnl, "dayPnl");
    if (payload.dayPnlPercent !== undefined) updatable.dayPnlPercent = parseNumber(payload.dayPnlPercent, "dayPnlPercent");
    if (payload.holdingsCount !== undefined) updatable.holdingsCount = parseNumber(payload.holdingsCount, "holdingsCount");
    if (payload.lastCalculatedAt !== undefined) updatable.lastCalculatedAt = payload.lastCalculatedAt;

    const updated = await Portfolio.findByIdAndUpdate(portfolio._id, updatable, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new AppError("Portfolio not found.", 404);
    }

    const populated = await populatePortfolio(Portfolio.findById(updated._id));
    const holdings = (populated.holdings || []).map(computeHoldingSnapshot);
    const portfolioObject = toPlain(populated);
    const metrics = buildMetrics({ ...portfolioObject, holdings });

    return { portfolio: portfolioObject, holdings, metrics };
  },

  async deletePortfolio(id, userId) {
    const portfolio = await Portfolio.findById(toId(id)).populate("user");

    if (!portfolio) {
      throw new AppError("Portfolio not found.", 404);
    }

    ensureOwnership(portfolio, userId);

    await Holding.deleteMany({ portfolio: portfolio._id });
    await Portfolio.findByIdAndDelete(portfolio._id);

    return { deletedId: portfolio._id.toString() };
  },
};
