import mongoose from 'mongoose'
require('dotenv').config()

process.on('uncaughtException', (err: Error) => {
  console.log('UNHANDLED EXCEPTION! 💥 Shutting down ...')
  console.log(err.name, err.message)
  process.exit(1)
})

import app from './app'

const URI: string = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!
)

mongoose.connect(URI)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.log('Connected to MongoDB'))

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.debug(`App running on port ${port}`)
})

process.on('uncaughtRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  server.close(() => console.log('💥 Process terminated!'))
})
