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
exports.ASSIGN_POINTS_FOR_EVENTS = void 0;
const response_messages_1 = require("../../utils/response_messages");
const evaluation_model_1 = require("../../models/evaluation.model");
const ASSIGN_POINTS_FOR_EVENTS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contributorGithubId } = req.params;
        const { points } = req.body;
        if (!points) {
            return res
                .status(400)
                .json({ message: "Points and description are required." });
        }
        const contributor = yield evaluation_model_1.EvaluationStorage.findOne({
            github_id: contributorGithubId,
        });
        if (!contributor) {
            return res.status(404).json({ message: "Contributor not found." });
        }
        contributor.totalPoints += points;
        contributor.adminAssignedPointsHistory.push({
            points,
            date: new Date(),
        });
        yield contributor.save();
        res
            .status(200)
            .json({ message: "Points assigned successfully", contributor });
    }
    catch (error) {
        console.error("Error assigning points:", error);
        res.status(500).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.ASSIGN_POINTS_FOR_EVENTS = ASSIGN_POINTS_FOR_EVENTS;
