import ApiResponse from "../../shared/utils/ApiResponse.utils";

export class SeriesController {
    constructor(seriesService) {
        this.seriesService = seriesService;
    }

    createSeries = async (req, res) => {
        const series =
            await this.seriesService.createSeries(
                req.validated.body,
                req.user.id
            );

        return ApiResponse(res, 201, "Series created successfully", series);
    };

    getAllSeries = async (req, res) => {
        const series =
            await this.seriesService.getAllSeries();

        return ApiResponse(res, 200, "Series fetched successfully", series);
    };

    getSeriesById = async (req, res) => {
        const series =
            await this.seriesService.getSeriesById(
                req.params.id
            );

        return ApiResponse(res, 200, "Series fetched successfully", series);
    };

    updateSeries = async (req, res) => {
        const series =
            await this.seriesService.updateSeries(
                req.params.id,
                req.validated.body,
                req.user.id
            );

        return ApiResponse(res, 200, "Series updated successfully", series);
    };

    deleteSeries = async (req, res) => {
        const series =
            await this.seriesService.deleteSeries(
                req.params.id
            );

        return ApiResponse(res, 200, "Series deleted successfully", series);
    };
}