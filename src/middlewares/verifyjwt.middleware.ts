import { Request, Response, NextFunction } from "express";
import { verifyJsonToken } from "../utils/jsonWebToken";
const VERIFY_TOKEN = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.token) {
    res.status(401).send({
      message: "No token provided!",
    });
  } else {
    const result: any = verifyJsonToken(req.body.token);
    if (result === null) {
      res.status(403).send({
        message: "Unauthorized!",
      });
      return;
    }
    res.locals.userId = result.payload;
    next();
  }
};

export { VERIFY_TOKEN };
