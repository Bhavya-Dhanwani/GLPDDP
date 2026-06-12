import ApiResponse from "../../shared/utils/ApiResponse.utils.js";
import SeriesService from "./series.service.js";

// Controller for Series endpoints - delegates requests to the service and formats HTTP responses
export default class SeriesController {
    constructor() {
        // Initialize SeriesService instance used by handlers
        this.seriesService = new SeriesService();
    }

    // Create series - expects req.body and authenticated req.user.id, returns 201 with created resource
    createSeries = async (req, res) => {
        const series =
            await this.seriesService.createSeries(
                req.body,
                req.user.id
            );

        return ApiResponse(res, 201, "Series created successfully", series);
    };
 
    // Get all series - supports optional name and season query filters
    getAllSeries = async (req, res) => {
        const series =
            await this.seriesService.getAllSeries(req.query);

        return ApiResponse(res, 200, "Series fetched successfully", series);
    };

    // Get series by id - returns the series or triggers a 404 from service
    getSeriesById = async (req, res) => {
        const series =
            await this.seriesService.getSeriesById(
                req.params.id
            );

        return ApiResponse(res, 200, "Series fetched successfully", series);
    };

    // Update series - accepts partial updates, uses req.user.id as updater
    updateSeries = async (req, res) => {
        const series =
            await this.seriesService.updateSeries(
                req.params.id,
                req.body,
                req.user.id
            );

        return ApiResponse(res, 200, "Series updated successfully", series);
    };

    // Delete series (soft-delete) - marks series as deleted and returns updated document
    deleteSeries = async (req, res) => {
        const series =
            await this.seriesService.deleteSeries(
                req.params.id
            );

        return ApiResponse(res, 200, "Series deleted successfully", series);
    };
}