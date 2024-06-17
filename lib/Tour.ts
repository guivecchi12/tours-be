import { Document, Schema } from 'mongoose'

type Location = {
  type: 'Point'
  coordinates: number[]
  address: string
  description: string
}

type Locations = Location & {
  day: number
}

interface TourInterface extends Document {
  name: string
  slug?: string
  duration: number
  maxGroupSize: number
  difficulty: string
  ratingsAverage?: number
  ratingQuantity?: number
  price: number
  priceDiscount?: number
  summary?: string
  description: string
  imageCover: string
  images?: string[]
  createdAt?: number
  startDates?: number[]
  secretTour?: Boolean
  startLocation: Location
  locations: Locations
  guides?: Schema.Types.ObjectId[]
  startTime?: number
}

export default TourInterface
