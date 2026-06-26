import { asyncHandler } from "../middleware/errorMiddleware.js";
import { portfolioService } from "../services/portfolioService.js";
import { AppError } from "../middleware/errorMiddleware.js";

const send = (res, statusCode, message, data) =>
  res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });

const getUserId = (req) => {
  if (!req.user?._id) {
    throw new AppError("Not authorized.", 401);
  }
  return req.user._id;
};

export const getPortfolio = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const result = await portfolioService.getOrCreateForUser(userId);
  return send(res, 200, "Portfolio retrieved successfully.", result);
});

export const getPortfolioById = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const result = await portfolioService.getById(req.params.id, userId);
  return send(res, 200, "Portfolio retrieved successfully.", result);
});

export const createPortfolio = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const result = await portfolioService.createPortfolio(userId, req.body);
  return send(res, 201, "Portfolio created successfully.", result);
});

export const updatePortfolio = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const result = await portfolioService.updatePortfolio(req.params.id, userId, req.body);
  return send(res, 200, "Portfolio updated successfully.", result);
});

export const deletePortfolio = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const result = await portfolioService.deletePortfolio(req.params.id, userId);
  return send(res, 200, "Portfolio deleted successfully.", result);
});
