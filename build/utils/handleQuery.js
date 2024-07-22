"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.getAll = exports.updateOne = exports.getOne = exports.createOne = void 0;
const catchAsync_1 = __importDefault(require("./catchAsync"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const appError_1 = __importDefault(require("./appError"));
const getOne = (Model, popOptions) => (0, catchAsync_1.default)(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    const doc = popOptions ? await query.populate(popOptions) : await query;
    if (!doc) {
        return next(new appError_1.default('No document found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: doc
    });
});
exports.getOne = getOne;
const getAll = (Model) => (0, catchAsync_1.default)(async (req, res, next) => {
    const { query, params } = req;
    const filter = params?.tourId ? { tour: params.tourId } : {};
    const features = new apiFeatures_1.default(Model.find(filter), query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const doc = await features.query;
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: doc
    });
});
exports.getAll = getAll;
const createOne = (Model) => (0, catchAsync_1.default)(async (req, res, next) => {
    const { body } = req;
    const doc = await Model.create(body);
    res.status(201).json({
        status: 'success',
        data: doc
    });
});
exports.createOne = createOne;
const updateOne = (Model) => (0, catchAsync_1.default)(async (req, res, next) => {
    const { body, params } = req;
    const updatedDoc = await Model.findByIdAndUpdate(params.id, body, {
        new: true,
        runValidators: true
    });
    if (!updatedDoc)
        return next(new appError_1.default('No document found with that ID', 404));
    res.status(200).json({
        status: 'success',
        data: updatedDoc
    });
});
exports.updateOne = updateOne;
const deleteOne = (Model) => (0, catchAsync_1.default)(async (req, res, next) => {
    const { params } = req;
    const doc = await Model.findByIdAndDelete(params.id);
    if (!doc) {
        return next(new appError_1.default('No document found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});
exports.deleteOne = deleteOne;
