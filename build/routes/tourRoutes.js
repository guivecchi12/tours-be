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
router
    .route('/top-5')
    .get(tourController_1.default.aliasTopTours, tourController_1.default.getAllTours);
router
    .route('/tour-stats')
    .get(tourController_1.default.getTourStats);
router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController_1.default.getToursWithin);
router
    .route('/distances/:latlng/unit/:unit')
    .get(tourController_1.default.getDistance);
router
    .route('/monthly-plan/:year')
    .get(tourController_1.default.getMonthlyPlan);
router
    .route('/:id')
    .get(tourController_1.default.getTour)
    .patch(tourController_1.default.uploadTourImages, tourController_1.default.resizeTourImages, tourController_1.default.updateTour)
    .delete(tourController_1.default.deleteTour);
exports.default = router;
