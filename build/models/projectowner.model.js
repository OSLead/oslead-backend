"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectOwner = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const projectOwnerSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    github_id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    linked_in: {
        type: String,
    },
    college_name: {
        type: String,
    },
    contact_number: {
        type: String,
    },
    roles: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Role",
        },
    ],
});
projectOwnerSchema.statics.build = (attr) => {
    return new ProjectOwner(attr);
};
const ProjectOwner = mongoose_1.default.model("ProjectOwner", projectOwnerSchema);
exports.ProjectOwner = ProjectOwner;
