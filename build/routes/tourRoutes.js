"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tourController_1 = __importDefault(require("../controllers/tourController"));
// import authController from '../controllers/authController'
// import reviewRouter from './reviewRoutes'
const router = express_1.default.Router();
// router.use('/:tourId/reviews', reviewRouter)
router
    .route('/')
    .get(tourController_1.default.getAllTours)
    .post(tourController_1.default.createTour);
exports.default = router;
