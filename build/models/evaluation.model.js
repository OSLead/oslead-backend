"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationStorage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const evalSchema = new mongoose_1.default.Schema({
    github_id: { type: String, required: true },
    username: { type: String, required: true },
    userId: { type: String, required: false },
    totalPoints: { type: Number, required: true, default: 0 },
    pointHistory: [
        {
            pull_url: { type: String, required: true },
            points: { type: Number, required: true },
            description: { type: String, required: true },
            difficulty: { type: String, required: true },
        },
    ],
});
evalSchema.statics.build = (attr) => {
    return new EvaluationStorage(attr);
};
const EvaluationStorage = mongoose_1.default.model("leaderBoard", evalSchema);
exports.EvaluationStorage = EvaluationStorage;
