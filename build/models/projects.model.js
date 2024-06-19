"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var Points;
(function (Points) {
    Points[Points["HARD"] = 100] = "HARD";
    Points[Points["MEDIUM"] = 60] = "MEDIUM";
    Points[Points["EASY"] = 40] = "EASY";
})(Points || (Points = {}));
const projectSchema = new mongoose_1.default.Schema({
    projectDetails: {
        type: Object,
        required: true,
    },
    ownedBy: {
        userId: { type: String, required: true },
        github_id: { type: String, required: true },
    },
    applied_contributors: [
        {
            name: { type: String },
            username: { type: String },
            userId: { type: String },
            github_id: { type: String },
        },
    ],
    points_history: [
        {
            pullId: { type: String },
            user: {
                name: { type: String },
                username: { type: String },
                userId: { type: String },
                github_id: { type: String },
            },
            point: {
                type: Number,
            },
        },
    ],
});
projectSchema.statics.build = (attr) => {
    return new Project(attr);
};
const Project = mongoose_1.default.model("Project", projectSchema);
exports.Project = Project;
