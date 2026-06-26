import { asyncHandler } from "../middleware/errorMiddleware.js";
import { dashboardService } from "../services/dashboardService.js";

const send = (res, statusCode, message, data) =>
  res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });

export const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getDashboard(req.user);
  return send(res, 200, "Dashboard retrieved successfully.", { dashboard });
});
