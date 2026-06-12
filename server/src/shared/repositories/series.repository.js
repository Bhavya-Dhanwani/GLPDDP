import Series from "../models/series.model.js";

// Repository for Series collection data access
export default class SeriesRepository {
    constructor() {
        // Mongoose model instance
        this.seriesModel = Series;
    }

    // Create a series document
    create(data) {
        return this.seriesModel.create(data);
    }

    // Find multiple series with optional filters
    findAll(filters = {}) {
        const query = {};

        if (filters.name) {
            query.name = {
                $regex: filters.name,
                $options: "i"
            };
        }

        if (filters.season) {
            query.season = {
                $regex: filters.season,
                $options: "i"
            };
        }

        return this.seriesModel.find(query);
    }

    // Find a series by its id
    findById(id) {
        return this.seriesModel.findOne({ _id: id });
    }

    // Find a series by name
    findByName(name) {
        return this.seriesModel.findOne({
            name: {
                $regex: `^${name.trim()}$`,
                $options: "i"
            }
        });
    }

    // Find a series by season
    findBySeason(season) {
        return this.seriesModel.findOne({ season });
    }

    // Update and return the updated series document
    update(id, data) {
        return this.seriesModel.findOneAndUpdate(
            { _id: id },
            data,
            {
                returnDocument: "after",
                runValidators: true,
            }
        );
    }

    // Soft-delete by setting isDeleted flag
    delete(id) {
        return this.seriesModel.findOneAndUpdate(
            { _id: id },
            { isDeleted: true },
            {
                returnDocument: "after",
            }
        );
    }

    // Check if a series exists by id
    exists(id) {
        return this.seriesModel.exists({ _id: id });
    }
}