"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const tourModel_1 = __importDefault(require("../models/tourModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const handleQuery_1 = require("../utils/handleQuery");
const multerStorage = multer_1.default.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new appError_1.default('Not an image! Please upload only images', 400));
    }
};
const upload = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter
});
const uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);
const resizeTourImages = (0, catchAsync_1.default)(async (req, res, next) => {
    const files = req.files;
    const timestamp = Date.now();
    // Cover Image
    if (files?.imageCover) {
        const imageCoverFilename = `tour-${req.params.id}-${timestamp}-cover.jpeg`;
        req.body.imageCover = imageCoverFilename;
        console.log('new image filename', imageCoverFilename);
        await (0, sharp_1.default)(files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/tours/${imageCoverFilename}`);
    }
    // Images
    if (files?.images) {
        req.body.images = [];
        await Promise.all(files.images.map(async (file, index) => {
            const filename = `tour-${req.params.id}-${timestamp}-${index + 1}.jpeg`;
            await (0, sharp_1.default)(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/tours/${filename}`);
            req.body.images?.push(filename);
        }));
    }
    next();
});
const aliasTopTours = (req, res, next) => {
    const { query } = req;
    query.limit = '5';
    query.sort = '-ratingsAverage,price';
    query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};
const getTourStats = (0, catchAsync_1.default)(async (req, res, next) => {
    // Get all tours with a rating of or above 4.5
    // Group them by difficulty and display stats
    // Sort it by average price in ascending order
    const rating = req.query.rating ? parseFloat(`${req.query.rating}`) : 4.5;
    const stats = await tourModel_1.default.aggregate([
        {
            $match: { ratingsAverage: { $gte: rating } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRating: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        }, {
            $sort: { avgPrice: 1 }
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: stats
    });
});
const getToursWithin = (0, catchAsync_1.default)(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const floatDistance = parseFloat(distance);
    const radius = unit === 'mi' ? floatDistance / 3963.2 : floatDistance / 6378.1;
    if (!lat || !lng)
        next(new appError_1.default('Latitude and Longitude are needed, in the format lat,lng', 400));
    const tours = await tourModel_1.default.find({
        startLocation: {
            $geoWithin: { $centerSphere: [[lng, lat], radius] }
        }
    });
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: tours
    });
});
const getDistance = (0, catchAsync_1.default)(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
    if (!lat || !lng)
        next(new appError_1.default('Latitude and Longitude are needed, in the format lat,lng', 400));
    const distances = await tourModel_1.default.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);
    res.status(200).json({
        status: 'success',
        results: distances.length,
        data: distances
    });
});
const getMonthlyPlan = (0, catchAsync_1.default)(async (req, res, next) => {
    const year = parseInt(req.params.year);
    const plan = await tourModel_1.default.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                totalMonthlyTours: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { month: 1 }
        },
        {
            $limit: 6
        }
    ]);
    res.status(200).json({
        status: 'success',
        results: plan.length,
        data: { plan }
    });
});
// const getTour = getOne(Tour, {path: 'reviews'})
const getTour = (0, handleQuery_1.getOne)(tourModel_1.default);
const getAllTours = (0, handleQuery_1.getAll)(tourModel_1.default);
const createTour = (0, handleQuery_1.createOne)(tourModel_1.default);
const updateTour = (0, handleQuery_1.updateOne)(tourModel_1.default);
const deleteTour = (0, handleQuery_1.deleteOne)(tourModel_1.default);
exports.default = {
    uploadTourImages,
    resizeTourImages,
    updateTour,
    aliasTopTours,
    getTourStats,
    getToursWithin,
    getDistance,
    getMonthlyPlan,
    getTour,
    getAllTours,
    createTour,
    deleteTour
};
