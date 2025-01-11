import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { Admin } from "../../models/admin.model";
import db from "../../models";
import { createJsonToken } from "../../utils/jsonWebToken";
import attachCookieToken from "../../utils/cookieToken";

const Role = db.roles;

const login_ADMIN = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const isPasswordMatch = await admin.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = createJsonToken(admin._id);
  attachCookieToken(token, res);
  res.status(200).json({ message: "Login successful", token });
};

export { login_ADMIN };