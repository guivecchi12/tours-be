"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const handleQuery_1 = require("../utils/handleQuery");
const getUser = (0, handleQuery_1.getOne)(userModel_1.default);
const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Use signup route instead'
    });
};
exports.default = { getUser, createUser };
