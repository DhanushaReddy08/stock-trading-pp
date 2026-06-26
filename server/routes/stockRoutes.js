import { Router } from "express";

import {
  createStock,
  deleteStock,
  getStockById,
  listStocks,
  searchStocks,
  updateStock,
} from "../controllers/stockController.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", listStocks);
router.get("/search", searchStocks);
router.get("/:id", getStockById);
router.post("/", protect, adminOnly, createStock);
router.put("/:id", protect, adminOnly, updateStock);
router.delete("/:id", protect, adminOnly, deleteStock);

export default router;
