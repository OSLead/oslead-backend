"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maintainer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MaintainerSchema = new mongoose_1.default.Schema({
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
    isBanned: {
        type: Boolean,
        default: false,
    },
    delivery_details: {
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        pincode: {
            type: String,
        },
        tshirt: {
            size: {
                type: String,
            },
            color: {
                type: String,
            },
        },
    },
    roles: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Role",
        },
    ],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
MaintainerSchema.virtual("projects", {
    ref: "Project",
    localField: "github_id",
    foreignField: "ownedBy.github_id",
});
MaintainerSchema.statics.build = (attr) => {
    return new Maintainer(attr);
};
const Maintainer = mongoose_1.default.model("Maintainer", MaintainerSchema);
exports.Maintainer = Maintainer;
