import express from 'express'

import tourController from '../controllers/tourController'
// import authController from '../controllers/authController'
// import reviewRouter from './reviewRoutes'

const router = express.Router()

// router.use('/:tourId/reviews', reviewRouter)

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour)

router
  .route('/top-5')
  .get(tourController.aliasTopTours, tourController.getAllTours)

router
  .route('/tour-stats')
  .get(tourController.getTourStats)

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin)

router
  .route('/distances/:latlng/unit/:unit')
  .get(tourController.getDistance)

router
  .route('/monthly-plan/:year')
  .get(tourController.getMonthlyPlan)

router
.route('/:id').get(tourController.getTour)
// .patch(tourController.uploadTourImages, tourController.resizeTourImages, tourController.updateTour)
.delete(tourController.deleteTour)
  

export default router
