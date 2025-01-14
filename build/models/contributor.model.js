"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
    profile_picture: {
        type: String,
        required: false,
    },
    linked_in: {
        type: String,
    },
    college_name: {
        type: String,
    },
    course_stream: {
        type: String,
    },
    contact_number: {
        type: String,
    },
    enrolledProjects: [
        {
            projectId: {
                type: String,
            },
            projectName: {
                type: String,
            },
            projectUrl: {
                type: String,
            },
            apiUrl: {
                type: String,
            },
        },
    ],
    roles: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Role",
        },
    ],
    isBanned: {
        type: Boolean,
        default: false,
    },
    delivery_details: {
        city: {
            type: String,
            required: false,
        },
        state: {
            type: String,
            required: false,
        },
        pincode: {
            type: String,
            required: false,
        },
        tshirt: {
            size: String,
            color: String,
        },
    },
});
userSchema.statics.build = (attr) => {
    return new User(attr);
};
const User = mongoose_1.default.model("Contributor", userSchema);
exports.User = User;
