import express from 'express'
import SeriesController from './series.controller.js';
import asyncHandler from '../../../shared/utils/asynchandler.util.js';
import validateErrors from '../../../shared/middlewares/validateErrors.middleware.js';
import { createSeriesValidator, deleteSeriesValidator, updateSeriesValidator } from './series.validator.js';

const router = express.Router();

const seriesController = new SeriesController();

/**
 * @route POST /api/series
 * @desc Create a new series
 * @access Private
 * @params { name: String, shortName: String, season: String, status: String, logo: String }
 */
router.post("/", createSeriesValidator, validateErrors, asyncHandler(seriesController.createSeries))

/**
 * @route PATCH /api/series/:id
 * @desc Update series by id
 * @access Private
 * @params { name: String, shortName: String, season: String, status: String, logo: String }
 */
router.patch("/:id", updateSeriesValidator, validateErrors, asyncHandler(seriesController.updateSeries))

/**
 * @route DELETE /api/series/:id
 * @desc Delete series by id
 * @access Private
 */
router.delete("/:id", deleteSeriesValidator, validateErrors, asyncHandler(seriesController.deleteSeries))


export default router;