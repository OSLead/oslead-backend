// remove this file in prod.
// the route already declared in contributor.route.ts

import express, { Request, Response } from "express";
import { VERIFY_TOKEN } from "../middlewares/verifyjwt.middleware";
import { USER_REGISTER } from "../controllers/contributor/register.controller";
import { VALIDATE_REGISTER } from "../middlewares/datavalidation.middleware";
const router = express.Router();

router.post("/register", [VERIFY_TOKEN, VALIDATE_REGISTER], USER_REGISTER);

export default router;
