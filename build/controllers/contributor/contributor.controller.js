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
exports.getContributorSelf = void 0;
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
