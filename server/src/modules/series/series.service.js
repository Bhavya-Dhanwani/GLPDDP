
import ApiError from '../../shared/utils/ApiError.util';

export class SeriesService {
    constructor(seriesRepository, matchRepository) {
        this.seriesRepository = seriesRepository;
        this.matchRepository = matchRepository;
    }

    async createSeries(data, userId) {
        const existingName =
            await this.seriesRepository.findByName(
                data.name
            );

        if (existingName) {
            throw new ApiError(
                statusCode = 409,
                message = "Series name already exists"
            );
        }

        const existingSeason =
            await this.seriesRepository.findBySeason(
                data.season
            );

        if (existingSeason) {
            throw new ApiError(
                statusCode = 409,
                message = "Series season already exists"
            );
        }

        return this.seriesRepository.create({
            ...data,
            createdBy: userId,
        });
    }

    async getAllSeries() {
        return this.seriesRepository.findAll();
    }

    async getSeriesById(id) {
        const series =
            await this.seriesRepository.findById(id);

        if (!series) {
            throw new ApiError(
                statusCode = 404,
                message = "Series not found"
            );
        }

        return series;
    }

    async updateSeries(id, data, userId) {
        const existingSeries =
            await this.seriesRepository.findById(id);

        if (!existingSeries) {
            throw new ApiError(
                statusCode = 404,
                message = "Series not found"
            );
        }

        if (
            data.name &&
            data.name !== existingSeries.name
        ) {
            const existingName =
                await this.seriesRepository.findByName(
                    data.name
                );

            if (existingName) {
                throw new ApiError(
                    statusCode = 409,
                    message = "Series name already exists"
                );
            }
        }

        if (
            data.season &&
            data.season !== existingSeries.season
        ) {
            const existingSeason =
                await this.seriesRepository.findBySeason(
                    data.season
                );

            if (existingSeason) {
                throw new ApiError(
                    statusCode = 409,
                    message = "Series season already exists"
                );
            }
        }

        return this.seriesRepository.update(
            id,
            {
                ...data,
                updatedBy: userId,
            }
        );
    }

    async deleteSeries(id) {
        const series =
            await this.seriesRepository.findById(id);

        if (!series) {
            throw new ApiError(
                statusCode = 404,
                message = "Series not found"
            );
        }

        const matchExists =
            await this.matchRepository.exists({
                seriesId: id,
            });

        if (matchExists) {
            throw new ApiError(
                statusCode = 409,
                message ="Cannot delete series with existing matches"
            );
        }

        return this.seriesRepository.delete(id);
    }
}