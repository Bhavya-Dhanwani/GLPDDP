import { Router } from "express";

import { authenticate, authorize } from "../../shared/middleware/auth.js";
import validateRequest from "../../shared/middleware/validateRequest.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

import { ROLES } from "../../shared/constants/roles.js";

import {
    createSeriesSchema,
    updateSeriesSchema,
    getSeriesByIdSchema,
} from "./validators/series.validator.js";

import { seriesController } from "./series.container.js";

const router = Router();

router.use(authenticate);

router.get(
    "/",
    authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
    asyncHandler(seriesController.getAllSeries)
);

router.get(
    "/:id",
    authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
    validateRequest(getSeriesByIdSchema),
    asyncHandler(seriesController.getSeriesById)
);

router.post(
    "/",
    authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
    validateRequest(createSeriesSchema),
    asyncHandler(seriesController.createSeries)
);

router.patch(
    "/:id",
    authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
    validateRequest(updateSeriesSchema),
    asyncHandler(seriesController.updateSeries)
);

router.delete(
    "/:id",
    authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
    validateRequest(getSeriesByIdSchema),
    asyncHandler(seriesController.deleteSeries)
);

export default router;