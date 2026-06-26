import { asyncHandler } from "../middleware/errorMiddleware.js";
import { stockService } from "../services/stockService.js";

const send = (res, statusCode, message, data) =>
  res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });

export const listStocks = asyncHandler(async (req, res) => {
  const result = await stockService.listStocks(req.query);
  return send(res, 200, "Stocks retrieved successfully.", result);
});

export const searchStocks = asyncHandler(async (req, res) => {
  const result = await stockService.searchStocks(req.query);
  return send(res, 200, "Stocks searched successfully.", result);
});

export const getStockById = asyncHandler(async (req, res) => {
  const stock = await stockService.getStockById(req.params.id);
  return send(res, 200, "Stock retrieved successfully.", { stock });
});

export const createStock = asyncHandler(async (req, res) => {
  const stock = await stockService.createStock(req.body);
  return send(res, 201, "Stock created successfully.", { stock });
});

export const updateStock = asyncHandler(async (req, res) => {
  const stock = await stockService.updateStock(req.params.id, req.body);
  return send(res, 200, "Stock updated successfully.", { stock });
});

export const deleteStock = asyncHandler(async (req, res) => {
  await stockService.deleteStock(req.params.id);
  return send(res, 200, "Stock deleted successfully.", {});
});
