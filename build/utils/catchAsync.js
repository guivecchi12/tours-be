"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}
exports.default = default_1;
