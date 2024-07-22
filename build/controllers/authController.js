"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET || 'ourSecret';
const jwtCookieExpires = parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "1");
const signToken = (id) => jsonwebtoken_1.default.sign({ id }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN
});
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + jwtCookieExpires * 24 * 60 * 60 * 1000 // time in milliseconds
        ),
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        httpOnly: true // protect from site scrypting attacks. It will receive, store and send, not allowing for any middle man
    });
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};
const checkPassword = async (passwordAttempt, userPassword) => {
    return await bcryptjs_1.default.compareSync(passwordAttempt, userPassword);
};
const login = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return next(new appError_1.default('Email and password required', 400));
    const user = await userModel_1.default.findOne({ email }).select('+password');
    console.log('user', !!user);
    if (!user || !await (checkPassword(password, user.password)))
        return next(new appError_1.default('Incorrect email/password', 401));
    createSendToken(user, 200, req, res);
});
exports.default = { login };
