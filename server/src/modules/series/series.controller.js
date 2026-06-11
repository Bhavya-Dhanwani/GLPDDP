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

        return res.status(201).json({
            success: true,
            data: series,
        });
    };

    getAllSeries = async (req, res) => {
        const series =
            await this.seriesService.getAllSeries();

        return res.status(200).json({
            success: true,
            data: series,
        });
    };

    getSeriesById = async (req, res) => {
        const series =
            await this.seriesService.getSeriesById(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: series,
        });
    };

    updateSeries = async (req, res) => {
        const series =
            await this.seriesService.updateSeries(
                req.params.id,
                req.validated.body,
                req.user.id
            );

        return res.status(200).json({
            success: true,
            data: series,
        });
    };

    deleteSeries = async (req, res) => {
        const series =
            await this.seriesService.deleteSeries(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: series,
        });
    };
}