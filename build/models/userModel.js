"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, 'This email is not valid']
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
            validator: function (passwordConfirmation) {
                return passwordConfirmation === this.password;
            }
        }
    },
});
userSchema.pre('save', async function (next) {
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    this.passwordConfirmation = undefined;
    next();
});
userSchema.pre(/^find/, function (next) {
    // query middleware
    this.find({ active: { $ne: false } });
    next();
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
