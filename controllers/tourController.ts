import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import sharp from 'sharp'
import Tour from '../models/tourModel'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'
import { createOne, getAll, getOne, deleteOne, updateOne } from '../utils/handleQuery'
import MulterRequest from '../lib/MulterRequest'

const multerStorage = multer.memoryStorage()

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image! Please upload only images', 400))
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

const uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
])

const resizeTourImages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = (req as MulterRequest).files
    const timestamp = Date.now()
    
    // Cover Image
    if (files?.imageCover){

      const imageCoverFilename = `tour-${req.params.id}-${timestamp}-cover.jpeg`
      req.body.imageCover = imageCoverFilename

      console.log('new image filename', imageCoverFilename)
      await sharp(files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${imageCoverFilename}`)
    }

    // Images
    if(files?.images){
      req.body.images = []

      await Promise.all(
        files.images.map(async (file, index) => {
          const filename = `tour-${req.params.id}-${timestamp}-${index + 1}.jpeg`
          await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/tours/${filename}`)
          req.body.images?.push(filename)
        })
      )
    }

    next()
  }
)

const aliasTopTours = (req: Request, res: Response, next: NextFunction) => {
  const { query } = req
  query.limit = '5'
  query.sort = '-ratingsAverage,price'
  query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

const getTourStats = catchAsync(async (req, res, next) => {
  // Get all tours with a rating of or above 4.5
  // Group them by difficulty and display stats
  // Sort it by average price in ascending order
  const rating = req.query.rating ? parseFloat(`${req.query.rating}`) : 4.5

  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: rating } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: {  $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      }
    },{
    $sort: { avgPrice: 1 }
  }
  ])
  res.status(200).json({
    status: 'success',
    data: stats
  })
})

const getToursWithin = catchAsync(async (req, res, next) => {
  const {distance, latlng, unit} = req.params
  const[lat, lng] = latlng.split(',')

  const floatDistance = parseFloat(distance)

  const radius = unit === 'mi' ? floatDistance / 3963.2 : floatDistance / 6378.1

  if(!lat || !lng) next(new AppError('Latitude and Longitude are needed, in the format lat,lng', 400))

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] }
    }
  })

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours
  })
})

const getDistance = catchAsync(async (req, res, next) => {
  const {latlng, unit} = req.params
  const [lat, lng] = latlng.split(',')

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001

  if(!lat || !lng) next(new AppError('Latitude and Longitude are needed, in the format lat,lng', 400))

  const distances = await Tour.aggregate([
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
  ])  

  res.status(200).json({
    status: 'success',
    results: distances.length,
    data: distances
  })
})

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = parseInt(req.params.year)
  const plan = await Tour.aggregate([
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
      $sort: { month: 1}
    },
    {
      $limit: 6
    }
  ])
  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: { plan }
  })
})

// const getTour = getOne(Tour, {path: 'reviews'})
const getTour = getOne(Tour)
const getAllTours = getAll(Tour)
const createTour = createOne(Tour)
const updateTour = updateOne(Tour)
const deleteTour = deleteOne(Tour)

export default {
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
}
