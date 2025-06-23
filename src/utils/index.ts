import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (data: any) => {
  return jwt.sign({ ...data }, process.env.JWT_SECRET as string, {
    expiresIn: "2h",
  });
};
