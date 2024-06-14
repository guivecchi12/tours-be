import mongoose from 'mongoose'
import catchAsync from './catchAsync'
import APIFeatures from '../utils/apiFeatures'


const getAll = (Model: mongoose.Model<any>) =>
  catchAsync(async (req, res, next) => {
    console.log('Get All')
    const { query, params } = req
    const filter = params?.tourId ? { tour: params.tourId } : {}

    const features = new APIFeatures(Model.find(filter), query)
      .filter()
      .sort()
      .limitFields()
      .paginate()

    const doc = await features.getQuery()

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc
    })
  })

const createOne = (Model: mongoose.Model<any>) =>
  catchAsync(async (req, res, next) => {
    const { body } = req
    const doc = await Model.create(body)

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    })
  })



export { createOne, getAll}
