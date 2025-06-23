import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel";
import expressAsyncHandler from "express-async-handler";
import { HTTP_STATUS_CODE, USER_TYPE } from "../constants";
import { generateToken } from "../utils";
import { UserType } from "../types";

// @desc User Login
// @route POST /api/auth/login
// @access public
export const login = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST);
      throw new Error("Invalid request.");
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(HTTP_STATUS_CODE.NOT_FOUND);
      throw new Error("User not found.");
    }

    const responseObj: UserType & { token: string } = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: "",
    };

    if (user.role === USER_TYPE.HR) {
      if (!(user.password === password)) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST);
        throw new Error("Invalid credentials");
      }
      responseObj.token = generateToken(responseObj);
      res.json({ message: "Logged In Successfully!", user: responseObj });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST);
      throw new Error("Invalid credentials");
    }

    responseObj.token = generateToken(responseObj);
    res.json({ message: "Logged In Successfully!", user: responseObj });
  }
);

// @desc Get LoggedIn User
// @route Get /api/auth/user/:id
// @access private
export const getUserProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(HTTP_STATUS_CODE.NOT_FOUND);
      throw new Error("User not found");
    }
    const data: UserType = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    res.json(data);
  } catch (error) {
    res.status(HTTP_STATUS_CODE.SERVER_ERROR);
    throw new Error("Server error");
  }
};
