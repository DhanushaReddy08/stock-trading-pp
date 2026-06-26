import { Router } from "express";

import {
  createPortfolio,
  deletePortfolio,
  getPortfolio,
  getPortfolioById,
  updatePortfolio,
} from "../controllers/portfolioController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getPortfolio);
router.get("/:id", protect, getPortfolioById);
router.post("/", protect, createPortfolio);
router.put("/:id", protect, updatePortfolio);
router.delete("/:id", protect, deletePortfolio);

export default router;
