export class SeriesRepository {
    constructor(seriesModel) {
        this.seriesModel = seriesModel;
    }

    create(data) {
        return this.seriesModel.create(data);
    }

    findAll() {
        return this.seriesModel.find();
    }

    findById(id) {
        return this.seriesModel.findOne({ _id: id });
    }

    findByName(name) {
        return this.seriesModel.findOne({ name });
    }

    findBySeason(season) {
        return this.seriesModel.findOne({ season });
    }

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

    delete(id) {
        return this.seriesModel.findOneAndUpdate(
            { _id: id },
            { isDeleted: true },
            {
                returnDocument: "after",
            }
        );
    }

    exists(id) {
        return this.seriesModel.exists({ _id: id });
    }
}