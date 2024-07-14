import compression from 'compression'
import path from 'path'
import express from 'express'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import tourRouter from './routes/tourRoutes'
import userRouter from './routes/userRoutes'
import AppError from './utils/appError'
import globalErrorHandler from './controllers/errorController'

const app = express()

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'worker-src': ['blob:'],
        'child-src': ['blob:', 'https://js.stripe.com/'],
        'img-src': ["'self'", 'data: image/webp'],
        'script-src': [
          "'self'",
          'https://api.mapbox.com',
          'https://cdnjs.cloudflare.com',
          'https://js.stripe.com/v3/',
          "'unsafe-inline'"
        ],
        'connect-src': [
          "'self'",
          'ws://localhost:*',
          'ws://127.0.0.1:*',
          'http://127.0.0.1:*',
          'http://localhost:*',
          'https://*.tiles.mapbox.com',
          'https://api.mapbox.com',
          'https://events.mapbox.com'
        ]
      }
    },
    crossOriginEmbedderPolicy: false
  })
)

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Protect from DoS (Denial of service) and Brute Force attacks
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
})
app.use('/api', limiter)

//Stripe
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' })
  //   bookingController.webhookCheckout
)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })) //limit body size to 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
)

app.use(compression())

// Routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
// app.use('/api/v1/reviews', reviewRouter)
// app.use('/api/v1/booking', bookingRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

export default app
