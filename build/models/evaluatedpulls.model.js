"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluatedStorage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const evaluatedSchema = new mongoose_1.default.Schema({
    github_id: { type: String, required: true },
    username: { type: String, required: true },
    userId: { type: String, required: false },
    pullUrl: { type: String, required: true },
    pointGivenTo: {
        github_id: { type: String, required: true },
        points: { type: Number, required: true },
        username: { type: String, required: true },
    },
});
evaluatedSchema.statics.build = (attr) => {
    return new EvaluatedStorage(attr);
};
const EvaluatedStorage = mongoose_1.default.model("EvaluatedStorageHistory", evaluatedSchema);
exports.EvaluatedStorage = EvaluatedStorage;
