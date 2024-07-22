"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tourModel_1 = __importDefault(require("./tourModel"));
const tourData = {
    "name": "Fake ten letter name",
    "duration": 2,
    "maxGroupSize": 1,
    "difficulty": "easy",
    "price": 10,
    "description": "My tour",
    "imageCover": "http://image.png",
    "startLocation": {
        "type": 'Point',
        "coordinates": [
            1,
            2
        ],
        "address": "123 N 321 W",
        "description": "tour address"
    }
};
describe("tours model", () => {
    describe("GET", () => {
        test("successfully get all", async () => {
            const tours = await tourModel_1.default.find({});
            expect(tours.length).toBeGreaterThan(0);
        });
    });
    describe("POST", () => {
        test("create, save & delete successfully", async () => {
            const validTour = new tourModel_1.default(tourData);
            const savedTour = await validTour.save();
            expect(savedTour._id).toBeDefined();
            expect(savedTour.name).toBe(tourData.name);
            expect(savedTour.price).toBe(tourData.price);
            const deletedTour = await savedTour.deleteOne();
            expect(deletedTour.deletedCount).toBe(1);
        });
        test("Fail on missing data", async () => {
            const missingData = new tourModel_1.default({});
            try {
                await missingData.save();
            }
            catch (error) {
                expect(error).toBeInstanceOf(mongoose_1.default.Error.ValidationError);
                // missing name
                expect(error.errors.name).toBeDefined();
                expect(error.errors.name.message).toBe('Tour must have a name');
                // missing duration
                expect(error.errors.duration).toBeDefined();
                expect(error.errors.duration.message).toBe('Tour must have a duration');
                // missing group size
                expect(error.errors.maxGroupSize).toBeDefined();
                expect(error.errors.maxGroupSize.message).toBe('Tour must have a maximum group size');
                // missing price
                expect(error.errors.price).toBeDefined();
                expect(error.errors.price.message).toBe('Tour must have price');
                // missing description
                expect(error.errors.description).toBeDefined();
                expect(error.errors.description.message).toBe('Tour must have description');
                // missing imageCover
                expect(error.errors.imageCover).toBeDefined();
                expect(error.errors.imageCover.message).toBe('Tour needs a cover image');
            }
        });
    });
});
