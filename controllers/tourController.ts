import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import sharp from 'sharp'
import Tour from '../models/tourModel'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'
import { createOne, getAll } from '../utils/handleQuery'
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
    const files = req.files

    console.log(files)
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

    next()
  }
)

const getAllTours = getAll(Tour)
const createTour = createOne(Tour)

export default {
  uploadTourImages,
  resizeTourImages,
  getAllTours,
  createTour
}
