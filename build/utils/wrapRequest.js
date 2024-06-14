"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const axios_1 = __importDefault(require("axios"));
const instance = axios_1.default.create({
    timeout: 3000
});
const request = (options) => {
    // do something wrap
    return instance.request(options).then((res) => res.data);
};
exports.request = request;
