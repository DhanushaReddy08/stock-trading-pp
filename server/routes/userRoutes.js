import { Router } from "express";

import { getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

export default router;
