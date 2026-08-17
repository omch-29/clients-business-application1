import { Router } from "express";
import {
  getProducts,
  getAllProductsAdmin,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protectAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getProducts));
router.get("/admin/all", protectAdmin, asyncHandler(getAllProductsAdmin));
router.get("/:id", asyncHandler(getProduct));
router.post("/", protectAdmin, asyncHandler(createProduct));
router.put("/:id", protectAdmin, asyncHandler(updateProduct));
router.delete("/:id", protectAdmin, asyncHandler(deleteProduct));

export default router;
