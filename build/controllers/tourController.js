"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
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
    console.log(files);
    // if (!files['imageCover'] || !files?.images) return next()
    // const timestamp = Date.now()
    // // Cover Image
    // const imageCoverFilename = `tour-${req.params.id}-${timestamp}-cover.jpeg`
    // req.body.imageCover = imageCoverFilename
    // await sharp(req.files.imageCover[0].buffer)
    //   .resize(2000, 1333)
    //   .toFormat('jpeg')
    //   .jpeg({ quality: 90 })
    //   .toFile(`public/img/tours/${imageCoverFilename}`)
    // // Images
    // req.body.images = []
    // await Promise.all(
    //   req.files.images.map(async (file, index) => {
    //     const filename = `tour-${req.params.id}-${timestamp}-${index + 1}.jpeg`
    //     await sharp(file.buffer)
    //       .resize(2000, 1333)
    //       .toFormat('jpeg')
    //       .jpeg({ quality: 90 })
    //       .toFile(`public/img/tours/${filename}`)
    //     req.body.images?.push(filename)
    //   })
    // )
    next();
});
const getAllTours = async (req, res, next) => {
    try {
        console.log('Get All Simple');
        const { query, params } = req;
        console.log(`query: ${query} params: ${params}`);
        const tours = await tourModel_1.default.find({});
        console.log("queried tours", tours);
        res.status(201).json({
            status: 'success',
            data: {
                tours
            }
        });
    }
    catch (err) {
        next();
    }
};
const createTour = (0, handleQuery_1.createOne)(tourModel_1.default);
exports.default = {
    uploadTourImages,
    resizeTourImages,
    getAllTours,
    createTour
};
