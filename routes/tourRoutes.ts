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

export default router
