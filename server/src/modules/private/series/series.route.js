import express from 'express'
import SeriesController from './series.controller.js';
import authMiddleware from '../../../shared/middlewares/auth.middleware.js';
import asyncHandler from '../../../shared/utils/asynchandler.util.js';
import validateErrors from '../../../shared/middlewares/validateErrors.middeware.js';
import { createSeriesValidator, updateSeriesValidator } from './series.validator.js';
const router = express.Router();

const seriesController = new SeriesController();

/**
 * @route POST /api/series
 * @desc Create a new series
 * @access Private
 * @params { name: String, shortName: String, season: String, status: String, logo: String }
 */
router.post("/", createSeriesValidator, authMiddleware, validateErrors, asyncHandler(seriesController.createSeries))

/**
 * @route PATCH /api/series/:id
 * @desc Update series by id
 * @access Private
 * @params { name: String, shortName: String, season: String, status: String, logo: String }
 */
router.patch("/:id", updateSeriesValidator, authMiddleware, validateErrors, asyncHandler(seriesController.updateSeries))

/**
 * @route DELETE /api/series/:id
 * @desc Delete series by id
 * @access Private
 */
router.delete("/:id", authMiddleware, asyncHandler(seriesController.deleteSeries))


export default router;