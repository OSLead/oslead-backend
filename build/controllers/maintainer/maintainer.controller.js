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
exports.BAN_MAINTAINER = exports.GET_ALL_MAINTAINERS = exports.GET_MAINTAINER_PERSONAL_DETAILS = void 0;
const response_messages_1 = require("../../utils/response_messages");
const maintainer_model_1 = require("../../models/maintainer.model");
const GET_MAINTAINER_PERSONAL_DETAILS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    try {
        const result = yield maintainer_model_1.Maintainer.findOne({ _id: userId }).select("-roles");
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
exports.GET_MAINTAINER_PERSONAL_DETAILS = GET_MAINTAINER_PERSONAL_DETAILS;
const GET_ALL_MAINTAINERS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchAll = req.query.fetch === "all";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const selectChoice = [
            "projectDetails.name",
            "projectDetails.html_url",
            "projectDetails.description",
            "projectDetails.language",
            "projectDetails.owner.login",
            "projectDetails.owner.avatar_url",
        ].join(" ");
        let maintainers, total;
        if (fetchAll) {
            maintainers = yield maintainer_model_1.Maintainer.find({}).populate({
                path: "projects",
                select: `${selectChoice}`,
            });
            total = maintainers.length;
        }
        else {
            maintainers = yield maintainer_model_1.Maintainer.find()
                .skip(skip)
                .limit(limit)
                .populate({
                path: "projects",
                select: `${selectChoice} `,
            });
            total = yield maintainer_model_1.Maintainer.countDocuments();
        }
        if (!total) {
            res.status(404).send({ message: "No contributors found" });
            return;
        }
        res.status(200).send({
            total,
            page,
            limit,
            maintainers,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.GET_ALL_MAINTAINERS = GET_ALL_MAINTAINERS;
const BAN_MAINTAINER = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { maintainerId } = req.params;
        const maintainer = yield maintainer_model_1.Maintainer.findById(maintainerId);
        if (!maintainer) {
            return res.status(404).send({ message: "Maintainer not found" });
        }
        maintainer.isBanned = !maintainer.isBanned;
        yield maintainer.save();
        const action = maintainer.isBanned ? "banned" : "unbanned";
        res.status(200).send({
            message: `Maintainer has been successfully ${action}`,
            maintainer,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.BAN_MAINTAINER = BAN_MAINTAINER;
