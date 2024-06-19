import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createJsonToken = (payload: string) => {
  return jwt.sign({ payload }, `${process.env.JWT_SECRET_KEY}`, {
    expiresIn: "7 days",
  });
};

const verifyJsonToken = (token: string) => {
  try {
    const result = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`);
    return result;
  } catch (error) {
    return null;
  }
};

export { createJsonToken, verifyJsonToken };
