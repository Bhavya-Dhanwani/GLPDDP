// Importing modules
import NotFound from "../../../shared/errors/notfound.error.js";
import SeriesRepository from '../../../shared/repositories/series.repository.js';

// Service handling Series business logic and validation
export default class SeriesService {
    constructor() {
        // Repository for data operations
        this.seriesRepository = new SeriesRepository();
        // this.matchRepository = matchRepository;
    }

    // Retrieve all series, applying optional filters for name and season
    async getAllSeries(queryParams) {

        console.log("Query Params:", queryParams); // Debug log to check incoming query parameters

        const filters = {
            name: queryParams.name?.trim(),
            season: queryParams.season?.trim()
        }
        return this.seriesRepository.findAll(filters);
    }

    // Retrieve a single series by id, throw NotFound if missing
    async getSeriesById(id) {
        const series =
            await this.seriesRepository.findById(id);

        if (!series) {
            throw new NotFound("Series not found");
        }

        return series;
    }

}