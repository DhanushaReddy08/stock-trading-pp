import { Router } from "express";

import {
  createBuyOrder,
  createSellOrder,
  deleteOrder,
  getOrderById,
  listOrders,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, listOrders);
router.get("/:id", protect, getOrderById);
router.post("/buy", protect, createBuyOrder);
router.post("/sell", protect, createSellOrder);
router.delete("/:id", protect, deleteOrder);

export default router;
