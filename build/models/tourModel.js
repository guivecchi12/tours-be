"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const tourSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'Tour name must have less than 41 characters'],
        minlength: [10, 'Tour name must have more than 9 characters'],
        match: [/^[A-Za-z]+$/, 'Tour must only contain letters']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'Tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'Tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'Tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
        set: (val) => Math.round(val * 10) / 10 // 4.666 -> 46.66 -> 47 -> 4.7
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Tour must have price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price;
            },
            message: 'Discount ({VALUE}) should be less than regular price ({this.price})'
        }
    },
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Tour must have description']
    },
    imageCover: {
        type: String,
        required: [true, 'Tour needs a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } } // virtual is a property that is not stored in MongoDB
);
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
tourSchema.virtual('durationWeeks').get(function () {
    return Math.ceil(this.duration / 7);
});
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});
// DOCUMENT MIDDLEWARE, runs before .save() and .create()
tourSchema.pre('save', function (next) {
    console.log('pre save 1');
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
tourSchema.pre(/^find/, function (next) {
    console.log('pre search 1');
    this.find({ secretTour: { $ne: true } });
    this.startTime = Date.now();
    next();
});
tourSchema.pre(/^find/, function (next) {
    console.log('pre search 2');
    // this.populate({
    //   path: 'guides',
    //   select: '-__v -passwordChangedAt'
    // })
    next();
});
tourSchema.post(/^find/, function (doc, next) {
    console.log('post search 1');
    next();
});
const Tour = mongoose_1.default.model('Tour', tourSchema);
exports.default = Tour;
