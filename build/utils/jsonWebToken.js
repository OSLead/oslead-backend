"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJsonToken = exports.createJsonToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createJsonToken = (payload) => {
    return jsonwebtoken_1.default.sign({ payload }, `${process.env.JWT_SECRET_KEY}`, {
        expiresIn: "7 days",
    });
};
exports.createJsonToken = createJsonToken;
const verifyJsonToken = (token) => {
    try {
        const result = jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET_KEY}`);
        return result;
    }
    catch (error) {
        return null;
    }
};
exports.verifyJsonToken = verifyJsonToken;
