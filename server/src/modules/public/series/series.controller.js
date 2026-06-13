import ApiResponse from "../../../shared/utils/ApiResponse.utils.js";
import SeriesService from "./series.service.js";

// Controller for Series endpoints - delegates requests to the service and formats HTTP responses 
export default class SeriesController {
    constructor() {

        // Initialize SeriesService instance used by handlers
        this.seriesService = new SeriesService();

    }


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

}