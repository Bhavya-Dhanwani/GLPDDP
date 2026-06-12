// Importing modules
import Conflict from "../../../shared/errors/conflict.error.js";
import NotFound from "../../../shared/errors/notfound.error.js";
import SeriesRepository from '../../../shared/repositories/series.repository.js';

// Service handling Series business logic and validation
export default class SeriesService {
    constructor() {
        // Repository for data operations
        this.seriesRepository = new SeriesRepository();
        // this.matchRepository = matchRepository;
    }

    // Create a new series after validating uniqueness of name and season
    async createSeries(data, userId) {
        const existingName =
            await this.seriesRepository.findByName(
                data.name
            );

        if (existingName) {
            throw new Conflict("Series name already exists");
        }

        const existingSeason =
            await this.seriesRepository.findBySeason(
                data.season
            );

        if (existingSeason) {
            throw new Conflict("Series season already exists");
        }

        return this.seriesRepository.create({
            ...data,
            createdBy: userId,
        });
    }

    // Update an existing series after uniqueness checks
    async updateSeries(id, data, userId) {
        const existingSeries =
            await this.seriesRepository.findById(id);

        if (!existingSeries) {
            throw new NotFound("Series not found");
        }

        if (
            data.name &&
            data.name !== existingSeries.name
        ) {
            const existingName = await this.seriesRepository.findByName(
                data.name
            );

            if (existingName) {
                throw new Conflict("Series name already exists");
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
                throw new Conflict("Series season already exists");
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

    // Soft-delete a series after verifying it exists
    async deleteSeries(id,userId) {
        const series =
            await this.seriesRepository.findById(id);

        if (!series) {
            throw new NotFound("Series not found");
        }

        // const matchExists =
        //     await this.matchRepository.exists({
        //         seriesId: id,
        //     });

        // if (matchExists) {
        //     throw new throw new Conflict("Cannot delete series with existing matches");
        // }

        return this.seriesRepository.delete(id,userId);
    }
}