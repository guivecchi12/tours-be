"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
process.on('uncaughtException', (err) => {
    console.log('UNHANDLED EXCEPTION! 💥 Shutting down ...');
    console.log(err.name, err.message);
    process.exit(1);
});
const app_1 = __importDefault(require("./app"));
const URI = process.env.DATABASE_URI.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose_1.default.connect(URI);
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));
const port = process.env.PORT || 3000;
const server = app_1.default.listen(port, () => {
    console.debug(`App running on port ${port}`);
});
process.on('uncaughtRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => console.log('💥 Process terminated!'));
});
