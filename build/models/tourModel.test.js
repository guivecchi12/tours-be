"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tourModel_1 = __importDefault(require("./tourModel"));
const handleQuery_1 = require("../utils/handleQuery");
jest.mock('../utils/handleQuery');
describe('tour model', () => {
    it('should great tour', async () => {
        const tour = await (0, handleQuery_1.createOne)(tourModel_1.default);
        console.log(tour);
        expect(tour).toBe('');
    });
});
