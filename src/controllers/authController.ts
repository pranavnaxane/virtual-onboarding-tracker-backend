import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel";
import HRProfile from "../models/hrProfileModel";
import expressAsyncHandler from "express-async-handler";
import { HTTP_STATUS_CODE, USER_TYPE } from "../constants";
import { generateToken } from "../utils";
import { AppRequest, HRProfileType, UserProfileType } from "../types";

// @desc User Login
// @route POST /api/auth/user/login
// @access public
export const userLogin = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST);
      throw new Error("Invalid request.");
    }

    const user = await User.findOne({ email, role: USER_TYPE.USER });

    if (!user) {
      res.status(HTTP_STATUS_CODE.NOT_FOUND);
      throw new Error("User not found.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST);
      throw new Error("Invalid credentials");
    }

    const token = generateToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: "Logged In Successfully!",
      user: {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  }
);

// @desc HR Login
// @route POST /api/auth/hr/login
// @access public
export const hrLogin = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST);
      throw new Error("Invalid request.");
    }

    const user = await HRProfile.findOne({ email, role: USER_TYPE.HR });

    if (!user) {
      res.status(HTTP_STATUS_CODE.NOT_FOUND);
      throw new Error("User not found.");
    }

    if (!(user.password === password)) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST);
      throw new Error("Invalid credentials");
    }
    const token = generateToken({
      hrId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    res.json({
      message: "Logged In Successfully!",
      user: {
        hrId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  }
);

// @desc Get LoggedIn User
// @route Get /api/auth/user/
// @access private
export const getUserProfile = expressAsyncHandler(
  async (req: AppRequest, res: Response) => {
    try {
      const user = await User.findById(req.user?.id);
      if (!user) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND);
        throw new Error("User not found");
      }
      const data: UserProfileType = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber,
        department: user.department,
        joiningDate: user.joiningDate,
        hrId: user.hrId,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      res.json(data);
    } catch (error) {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR);
      throw new Error("Server error");
    }
  }
);

// @desc Get LoggedIn HR Profile
// @route Get /api/auth/hr/
// @access private
export const getHRProfile = expressAsyncHandler(
  async (req: AppRequest, res: Response) => {
    try {
      const user = await HRProfile.findById(req.user?.id);

      if (!user) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND);
        throw new Error("User not found");
      }
      const data: HRProfileType = {
        hrId: user.id,
        name: user.name,
        designation: user.designation,
        role: user.role,
        email: user.email,
        region: user.region,
        assignedDepartments: [...user.assignedDepartments],
        isActive: false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      res.json(data);
    } catch (error) {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR);
      throw new Error("Server error");
    }
  }
);
