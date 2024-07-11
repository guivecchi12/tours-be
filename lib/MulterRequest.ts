import { Request } from 'express'

interface MulterRequest extends Request {
  files?: {
    imageCover: Express.Multer.File[]
    images: Express.Multer.File[]
  }
  body: {
    imageCover?: string
    images?: string[]
  }
}

export default MulterRequest
