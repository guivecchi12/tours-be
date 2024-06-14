"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Schema
const schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String
});
schema.pre('save', function () {
    console.log(this.name); // TypeScript knows that `this` is a `mongoose.Document & User` by default
});
