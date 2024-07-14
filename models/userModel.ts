import { Schema, Model, Query, model } from 'mongoose'
import { UserCreation } from '../lib/User'
import validator from 'validator'
import bcrypt from 'bcryptjs'

interface UserQueryHelpers {
    active(this: Query<any, UserCreation>): Query<any, UserCreation>;
}

const userSchema = new Schema<UserCreation, Model<UserCreation, UserQueryHelpers>, UserQueryHelpers>(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'This email is not valid']
        },
        name: {
            type: String,
            required: [true, "User's name is required"]
        },
        photo: {
            type: String,
            default: 'default.jpg'
        },
        role: {
            type: String,
            enum: ["user", "guide", "lead-guide", "admin"],
            default: "user"
        },
        active: {
            type: Boolean,
            default: true,
            select: false
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false
        },
        passwordConfirmation: {
            type: String,
            required: [true, 'Please confirm password'],
            validate: {
                validator: function(passwordConfirmation: string){
                    return passwordConfirmation === (this as UserCreation).password
                }
            }
        },
    }
)


userSchema.pre<UserCreation>('save', async function(next){
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirmation = undefined
    next()
})

userSchema.pre(/^find/, function (next) {
  // query middleware
  (this as Query<any, UserCreation>).find({ active: { $ne: false } })
  next()
})

const User = model<UserCreation, Model<UserCreation, UserQueryHelpers>>('User', userSchema);

export default User