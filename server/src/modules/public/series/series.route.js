// Importing modules
import express from 'express'
import SeriesController from './series.controller.js';
import asyncHandler from '../../../shared/utils/asynchandler.util.js';
import validateErrors from '../../../shared/middlewares/validateErrors.middeware.js';
import { getSeriesByIdValidator } from './series.validator.js';


const router = express.Router();

const seriesController = new SeriesController();

/**
 * @route GET /api/series 
 * @desc Get all series
 * @access Private
 */
router.get("/", asyncHandler(seriesController.getAllSeries))

/**
 * @route GET /api/series/:id
 * @desc Get series by id
 * @access Private
 */
router.get("/:id", getSeriesByIdValidator, validateErrors, asyncHandler(seriesController.getSeriesById))

export default router;