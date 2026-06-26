import mongoose from "mongoose";
import Stock from "../models/Stock.js";
import { AppError } from "../middleware/errorMiddleware.js";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const ALLOWED_SORT_FIELDS = new Set([
  "createdAt",
  "updatedAt",
  "symbol",
  "name",
  "price",
  "change",
  "changePercent",
  "marketCap",
  "sector",
  "exchange",
]);

const normalizePositiveInt = (value, fallback, max = Number.MAX_SAFE_INTEGER) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
};

const normalizeNumber = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
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

const buildFilter = (query = {}) => {
  const filter = {};

  if (query.sector) {
    filter.sector = String(query.sector).trim();
  }

  if (query.exchange) {
    filter.exchange = String(query.exchange).trim().toUpperCase();
  }

  if (query.status) {
    filter.status = String(query.status).trim().toUpperCase();
  }

  const marketCapMin = normalizeNumber(query.marketCapMin);
  const marketCapMax = normalizeNumber(query.marketCapMax);

  if (marketCapMin !== undefined || marketCapMax !== undefined) {
    filter.marketCap = {};
    if (marketCapMin !== undefined) filter.marketCap.$gte = marketCapMin;
    if (marketCapMax !== undefined) filter.marketCap.$lte = marketCapMax;
  }

  return filter;
};

const validateStockPayload = (payload, isUpdate = false) => {
  const errors = [];
  const requiredFields = [
    "symbol",
    "name",
    "exchange",
    "marketCap",
    "price",
    "change",
    "changePercent",
    "sector",
  ];

  if (isUpdate) return errors;

  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      errors.push(`${field} is required`);
    }
  }

  return errors;
};

const buildStockPayload = (body) => ({
  symbol: String(body.symbol || "").trim().toUpperCase(),
  name: String(body.name || "").trim(),
  exchange: String(body.exchange || "").trim().toUpperCase(),
  currency: body.currency ? String(body.currency).trim().toUpperCase() : "USD",
  marketCap: normalizeNumber(body.marketCap),
  sharesOutstanding: normalizeNumber(body.sharesOutstanding),
  description: body.description ? String(body.description).trim() : "",
  price: normalizeNumber(body.price),
  change: normalizeNumber(body.change) ?? 0,
  changePercent: normalizeNumber(body.changePercent) ?? 0,
  sector: body.sector ? String(body.sector).trim() : "",
  status: body.status ? String(body.status).trim().toUpperCase() : "ACTIVE",
});

const buildStockUpdatePayload = (body) => {
  const payload = {};

  if (body.symbol !== undefined) payload.symbol = String(body.symbol).trim().toUpperCase();
  if (body.name !== undefined) payload.name = String(body.name).trim();
  if (body.exchange !== undefined) payload.exchange = String(body.exchange).trim().toUpperCase();
  if (body.currency !== undefined) payload.currency = String(body.currency).trim().toUpperCase();
  if (body.marketCap !== undefined) payload.marketCap = normalizeNumber(body.marketCap);
  if (body.sharesOutstanding !== undefined)
    payload.sharesOutstanding = normalizeNumber(body.sharesOutstanding);
  if (body.description !== undefined) payload.description = String(body.description).trim();
  if (body.price !== undefined) payload.price = normalizeNumber(body.price);
  if (body.change !== undefined) payload.change = normalizeNumber(body.change);
  if (body.changePercent !== undefined) payload.changePercent = normalizeNumber(body.changePercent);
  if (body.sector !== undefined) payload.sector = String(body.sector).trim();
  if (body.status !== undefined) payload.status = String(body.status).trim().toUpperCase();

  return payload;
};

export const stockService = {
  async listStocks(query) {
    const page = normalizePositiveInt(query.page, 1);
    const limit = normalizePositiveInt(query.limit, DEFAULT_LIMIT, MAX_LIMIT);
    const skip = (page - 1) * limit;

    const filter = buildFilter(query);
    const sort = normalizeSort(query.sortBy, query.sortOrder);

    const [items, total] = await Promise.all([
      Stock.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Stock.countDocuments(filter),
    ]);

    return {
      items,
      pagination: buildPagination({ page, limit, total }),
    };
  },

  async searchStocks(query) {
    const q = String(query.q || "").trim();

    if (!q) {
      throw new AppError("Query parameter q is required.", 400);
    }

    const page = normalizePositiveInt(query.page, 1);
    const limit = normalizePositiveInt(query.limit, DEFAULT_LIMIT, MAX_LIMIT);
    const skip = (page - 1) * limit;
    const filter = buildFilter(query);
    const search = {
      $or: [
        { symbol: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
      ],
    };

    const [items, total] = await Promise.all([
      Stock.find({ ...filter, ...search })
        .sort(normalizeSort(query.sortBy, query.sortOrder))
        .skip(skip)
        .limit(limit)
        .lean(),
      Stock.countDocuments({ ...filter, ...search }),
    ]);

    return {
      items,
      pagination: buildPagination({ page, limit, total }),
      query: q,
    };
  },

  async getStockById(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Invalid stock id.", 400);
    }

    const stock = await Stock.findById(id).lean();

    if (!stock) {
      throw new AppError("Stock not found.", 404);
    }

    return stock;
  },

  async createStock(payload) {
    const errors = validateStockPayload(payload);
    if (errors.length > 0) {
      throw new AppError(errors.join(", "), 400);
    }

    const data = buildStockPayload(payload);
    if (data.marketCap === undefined || data.price === undefined) {
      throw new AppError("marketCap and price must be valid numbers.", 400);
    }

    const stock = await Stock.create(data);
    return stock.toObject();
  },

  async updateStock(id, payload) {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Invalid stock id.", 400);
    }

    const data = buildStockUpdatePayload(payload);

    if (data.marketCap !== undefined && Number.isNaN(data.marketCap)) {
      throw new AppError("marketCap must be a valid number.", 400);
    }
    if (data.price !== undefined && Number.isNaN(data.price)) {
      throw new AppError("price must be a valid number.", 400);
    }
    if (data.change !== undefined && Number.isNaN(data.change)) {
      throw new AppError("change must be a valid number.", 400);
    }
    if (data.changePercent !== undefined && Number.isNaN(data.changePercent)) {
      throw new AppError("changePercent must be a valid number.", 400);
    }

    const stock = await Stock.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!stock) {
      throw new AppError("Stock not found.", 404);
    }

    return stock;
  },

  async deleteStock(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Invalid stock id.", 400);
    }

    const stock = await Stock.findByIdAndDelete(id).lean();

    if (!stock) {
      throw new AppError("Stock not found.", 404);
    }

    return stock;
  },
};
