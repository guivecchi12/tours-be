"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.createOne = void 0;
const catchAsync_1 = __importDefault(require("./catchAsync"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const getAll = (Model) => (0, catchAsync_1.default)(async (req, res, next) => {
    console.log('Get All');
    const { query, params } = req;
    const filter = params?.tourId ? { tour: params.tourId } : {};
    const features = new apiFeatures_1.default(Model.find(filter), query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const doc = await features.getQuery();
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
        data: {
            data: doc
        }
    });
});
exports.createOne = createOne;
