import ApiResponse from "../../../shared/utils/ApiResponse.utils.js";
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
                req.params.id,
                req.user.id
            );

        return ApiResponse(res, 200, "Series deleted successfully", series);
    };
}