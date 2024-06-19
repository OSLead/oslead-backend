import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const VALIDATE_REGISTER = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    linked_in,
    college_name,
    contact_number,
    course_stream,
    city,
    state,
    pincode,
    tsize,
    tcolor,
  } = req.body;

  const UserRegister = z.object({
    pincode: z.string().max(6).min(6),
  });
  const resultZod = UserRegister.safeParse(req.body);

  if (!resultZod.success) {
    return res.status(400).send({ message: resultZod.error });
  }

  if (!pincode) return res.status(400).send({ message: "Pincode is required" });

  next();
};

export { VALIDATE_REGISTER };
