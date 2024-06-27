import mongoose from 'mongoose'
import catchAsync from './catchAsync'
import APIFeatures from '../utils/apiFeatures'
import AppError from './appError'

type populateOptions = {
  path: string
}

const getOne = (Model: mongoose.Model<any>, popOptions?: populateOptions) => 
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id)
    const doc = popOptions ? await query.populate(popOptions) : await query

    if(!doc){
      return next(new AppError('No document found with that ID', 404))
    }

    res.status(200).json({
      status: 'success',
      data: doc
    })
  })


const getAll = (Model: mongoose.Model<any>) =>
  catchAsync(async (req, res, next) => {
    const { query, params } = req
    const filter = params?.tourId ? { tour: params.tourId } : {}

    const features = new APIFeatures(Model.find(filter), query)
      .filter()
      .sort()
      .limitFields()
      .paginate()

    const doc = await features.query

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
      data: doc
    })
  })

const deleteOne = (Model: mongoose.Model<any>) => catchAsync(async (req, res, next) => {
  const {params} = req
  const doc = await Model.findByIdAndDelete(params.id)

  if(!doc){
    return next(new AppError('No document found with that ID', 404))
  }

  res.status(204).json({
    status: 'success',
    data: null
  })
})

export { createOne, getOne, getAll, deleteOne}
