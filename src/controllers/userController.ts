import { Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { HTTP_STATUS_CODE, USER_TYPE } from "../constants";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import { AppRequest } from "../types";

// @desc Create User
// @route POST /api/users/create
// @access private
export const createUser = expressAsyncHandler(
  async (req: AppRequest, res: Response) => {
    const {
      name,
      email,
      password,
      role,
      contactNumber,
      department,
      joiningDate,
      status,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !role ||
      !contactNumber ||
      !department ||
      !joiningDate ||
      !status
    ) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST);
      throw new Error("Invalid request.");
    }

    if (req.user?.role !== USER_TYPE.HR) {
      res.status(HTTP_STATUS_CODE.UNAUTHORISED);
      throw new Error("Unauthorised user!");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const payload = {
      name,
      email,
      contactNumber,
      role,
      department,
      joiningDate,
      hrId: req.user?.id,
      status,
      password: hashedPassword,
    };

    const newUser = await User.create(payload);

    if (!newUser) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST);
      throw new Error("Invalid user data");
    }

    res.status(HTTP_STATUS_CODE.CREATED);
    res.json({ message: "User created successfully!", user: newUser });
  }
);

// @desc Get Users List
// @route POST /api/users/list
// @access private
export const getUsers = expressAsyncHandler(
  async (req: AppRequest, res: Response) => {
    if (req.user?.role !== USER_TYPE.HR) {
      res.status(HTTP_STATUS_CODE.UNAUTHORISED);
      throw new Error("Unauthorised user!");
    }

    const usersList = await User.find({
      hrId: req.user?.id,
      role: USER_TYPE.USER,
    }).select("-password");

    res.json(usersList);
  }
);

// @desc Get User By Id
// @route POST /api/users/:id
// @access private
export const getUserById = expressAsyncHandler(
  async (req: AppRequest, res: Response) => {
    const userId = req.params.id;
    if (req.user?.role !== USER_TYPE.HR) {
      res.status(HTTP_STATUS_CODE.UNAUTHORISED);
      throw new Error("Unauthorised user!");
    }

    const user = await User.findOne({
      _id: userId,
      hrId: req.user?.id,
    }).select("-password");

    if (!user) {
      res.status(HTTP_STATUS_CODE.NOT_FOUND);
      throw new Error("User Not Found.");
    }
    res.json({ user });
  }
);
