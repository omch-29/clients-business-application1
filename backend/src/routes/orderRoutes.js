import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protectAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(createOrder));
router.get("/", protectAdmin, asyncHandler(getOrders));
router.get("/:id", protectAdmin, asyncHandler(getOrder));
router.put("/:id/status", protectAdmin, asyncHandler(updateOrderStatus));

export default router;
