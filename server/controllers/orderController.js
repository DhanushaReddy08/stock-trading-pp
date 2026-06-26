import { asyncHandler, AppError } from "../middleware/errorMiddleware.js";
import { orderService } from "../services/orderService.js";

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

export const createBuyOrder = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const result = await orderService.createBuy(userId, req.body);
  return send(res, 201, "Buy order executed successfully.", {
    order: result.order,
    transaction: result.transaction,
    portfolio: result.portfolio,
    holdings: result.holdings,
    metrics: result.metrics,
  });
});

export const createSellOrder = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const result = await orderService.createSell(userId, req.body);
  return send(res, 201, "Sell order executed successfully.", {
    order: result.order,
    transaction: result.transaction,
    portfolio: result.portfolio,
    holdings: result.holdings,
    metrics: result.metrics,
  });
});

export const listOrders = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const result = await orderService.listOrders(userId, req.query);
  return send(res, 200, "Orders retrieved successfully.", result);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const result = await orderService.getOrderById(req.params.id, userId);
  return send(res, 200, "Order retrieved successfully.", { order: result });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const result = await orderService.deleteOrder(req.params.id, userId);
  return send(res, 200, "Order deleted successfully.", result);
});
