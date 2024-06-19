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
exports.GET_MAINTAINER_DASHBOARD_PROFILE = exports.GET_MAINTAINER_PERSONAL_DETAILS = void 0;
const response_messages_1 = require("../../utils/response_messages");
const maintainer_model_1 = require("../../models/maintainer.model");
const evaluatedpulls_model_1 = require("../../models/evaluatedpulls.model");
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
const GET_MAINTAINER_DASHBOARD_PROFILE = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    try {
        const userDetails = yield maintainer_model_1.Maintainer.findOne({ _id: userId }).select("-roles");
        if (!userDetails) {
            res.status(404).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_404 });
            return;
        }
        const aggregationResult = yield evaluatedpulls_model_1.EvaluatedStorage.aggregate([
            {
                $group: {
                    _id: "$github_id",
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 },
            },
        ]);
        const userRank = aggregationResult.findIndex((user) => user._id === userDetails.github_id);
        const evalDetails = yield evaluatedpulls_model_1.EvaluatedStorage.find({
            github_id: userDetails.github_id,
        }).select("pointGivenTo pullUrl");
        res.status(200).send({
            userDetails,
            rank: userRank !== -1 ? userRank + 1 : null,
            evalDetails,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.GET_MAINTAINER_DASHBOARD_PROFILE = GET_MAINTAINER_DASHBOARD_PROFILE;
