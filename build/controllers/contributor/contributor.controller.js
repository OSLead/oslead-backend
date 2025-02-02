"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BAN_CONTRIBUTOR = exports.DELETE_PROJECT_SELECTED_BY_CONTRIBUTOR = exports.getAllContributors = exports.getContributorSelf = void 0;
const contributor_model_1 = require("../../models/contributor.model");
const response_messages_1 = require("../../utils/response_messages");
const getContributorSelf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    try {
        const result = yield contributor_model_1.User.findOne({ _id: userId });
        if (!result) {
            res.status(404).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_404 });
            return;
        }
        res.status(200).send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.getContributorSelf = getContributorSelf;
const getAllContributors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const contributors = yield contributor_model_1.User.find()
            .skip(skip)
            .limit(limit);
        const totalContributors = yield contributor_model_1.User.countDocuments();
        if (!contributors.length) {
            res.status(404).send({ message: "No contributors found" });
            return;
        }
        res.status(200).send({
            total: totalContributors,
            page,
            limit,
            contributors,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.getAllContributors = getAllContributors;
const DELETE_PROJECT_SELECTED_BY_CONTRIBUTOR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contributorId, projectId } = req.params;
        if (!contributorId || !projectId) {
            return res.status(400).send({ message: "Contributor ID and Project ID are required." });
        }
        const updatedContributor = yield contributor_model_1.User.findOneAndUpdate({ _id: contributorId }, { $pull: { enrolledProjects: { projectId } } }, { new: true });
        if (!updatedContributor) {
            return res
                .status(404)
                .send({ message: "Contributor not found or unauthorized." });
        }
        return res.status(200).send({
            message: "Enrolled project deleted successfully.",
            updatedContributor,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error." });
    }
});
exports.DELETE_PROJECT_SELECTED_BY_CONTRIBUTOR = DELETE_PROJECT_SELECTED_BY_CONTRIBUTOR;
const BAN_CONTRIBUTOR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contributorId } = req.params;
        const contributor = yield contributor_model_1.User.findById(contributorId);
        if (!contributor) {
            return res.status(404).send({ message: "Maintainer not found" });
        }
        contributor.isBanned = !contributor.isBanned;
        yield contributor.save();
        const action = contributor.isBanned ? "banned" : "unbanned";
        res.status(200).send({
            message: `Contributor has been successfully ${action}`,
            contributor,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.BAN_CONTRIBUTOR = BAN_CONTRIBUTOR;
