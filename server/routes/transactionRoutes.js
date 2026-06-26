import { Router } from "express";

import { depositFunds, listTransactions, withdrawFunds } from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, listTransactions);
router.post("/deposit", protect, depositFunds);
router.post("/withdraw", protect, withdrawFunds);

export default router;
