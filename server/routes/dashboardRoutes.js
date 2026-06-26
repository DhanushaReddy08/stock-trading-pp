import { Router } from "express";

import { getDashboard } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getDashboard);

export default router;
