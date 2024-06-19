"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.Promise = global.Promise;
const db = {
    ROLES: ["contributor", "maintainer"],
    roles: require("./roles.model"),
    mongoose: mongoose_1.default,
};
exports.default = db;
