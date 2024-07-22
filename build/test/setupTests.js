"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// setupTests.ts
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
beforeAll(async () => {
    const URI = process.env.DATABASE_URI.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
    await mongoose_1.default.connect(URI);
});
afterAll(async () => {
    await mongoose_1.default.connection.close();
});
