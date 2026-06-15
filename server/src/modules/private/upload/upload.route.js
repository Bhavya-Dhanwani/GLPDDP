import express from "express";
import UploadController from "./upload.controller.js";
import asyncHandler from "../../../shared/utils/asynchandler.util.js";
import authMiddleware from "../../../shared/middlewares/auth.middleware.js";
import authorize from "../../../shared/middlewares/authorize.middleware.js";
import ROLES from "../../../shared/constants/roles.constants.js";

const router = express.Router();
const uploadController = new UploadController();

router.use(authMiddleware);
router.use(authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN));

router.get("/imagekit-auth", asyncHandler(uploadController.imageKitAuth));

export default router;
