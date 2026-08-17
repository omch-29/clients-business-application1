import { Router } from "express";
import upload from "../middleware/upload.js";
import { protectAdmin } from "../middleware/auth.js";
import { uploadImages } from "../controllers/uploadController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/", protectAdmin, upload.array("images", 8), asyncHandler(uploadImages));

export default router;
