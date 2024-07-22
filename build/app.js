"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const hpp_1 = __importDefault(require("hpp"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const tourRoutes_1 = __importDefault(require("./routes/tourRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            'worker-src': ['blob:'],
            'child-src': ['blob:', 'https://js.stripe.com/'],
            'img-src': ["'self'", 'data: image/webp'],
            'script-src': [
                "'self'",
                'https://api.mapbox.com',
                'https://cdnjs.cloudflare.com',
                'https://js.stripe.com/v3/',
                "'unsafe-inline'"
            ],
            'connect-src': [
                "'self'",
                'ws://localhost:*',
                'ws://127.0.0.1:*',
                'http://127.0.0.1:*',
                'http://localhost:*',
                'https://*.tiles.mapbox.com',
                'https://api.mapbox.com',
                'https://events.mapbox.com'
            ]
        }
    },
    crossOriginEmbedderPolicy: false
}));
// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Protect from DoS (Denial of service) and Brute Force attacks
const limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
//Stripe
app.post('/webhook-checkout', express_1.default.raw({ type: 'application/json' })
//   bookingController.webhookCheckout
);
// Body parser, reading data from body into req.body
app.use(express_1.default.json({ limit: '10kb' })); //limit body size to 10kb
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
app.use((0, cookie_parser_1.default)());
// Data sanitization against NoSQL query injection
app.use((0, express_mongo_sanitize_1.default)());
// Prevent parameter pollution
app.use((0, hpp_1.default)({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));
app.use((0, compression_1.default)());
// Routes
app.use('/api/v1/tours', tourRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
// app.use('/api/v1/reviews', reviewRouter)
// app.use('/api/v1/booking', bookingRouter)
app.all('*', (req, res, next) => {
    next(new appError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorController_1.default);
exports.default = app;
