import { Schema } from 'mongoose'

// Raw document interface. Contains the data type as it will be stored
// in MongoDB. So you can ObjectId, Buffer, and other custom primitive data types.
// But no Mongoose document arrays or subdocuments.
interface User {
  name: string
  email: string
  avatar?: string
}

// Schema
const schema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String
})

schema.pre('save', function (): void {
  console.log(this.name) // TypeScript knows that `this` is a `mongoose.Document & User` by default
})
