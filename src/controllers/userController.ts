import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { HTTP_STATUS_CODE, USER_TYPE } from "../constants";
import User from "../models/userModel";
import bcrypt from "bcryptjs";

// @desc Create User
// @route POST /api/users/create
// @access private
export const createUser = expressAsyncHandler(
  async (req: any, res: Response) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST);
      throw new Error("Invalid request.");
    }

    if (req.user?.role !== USER_TYPE.HR) {
      res.status(HTTP_STATUS_CODE.UNAUTHORISED);
      throw new Error("Unauthorised user!");
    }
    try {
      const userExists = await User.findOne({
        email,
        created_by: req.user?.id,
      });
      if (userExists) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST);
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const payload = {
        name,
        email,
        password: hashedPassword,
        role,
        created_by: req.user?.id,
      };

      const newUser = await User.create(payload);

      if (!newUser) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST);
        throw new Error("Invalid user data");
      }

      res.status(HTTP_STATUS_CODE.CREATED);
      res.json({ message: "User created successfully!", user: newUser });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR);
      throw new Error("Server error");
    }
  }
);

// @desc Get Users List
// @route POST /api/users/list
// @access private
export const getUsers = expressAsyncHandler(async (req: any, res: Response) => {
  if (req.user?.role !== USER_TYPE.HR) {
    res.status(HTTP_STATUS_CODE.UNAUTHORISED);
    throw new Error("Unauthorised user!");
  }

  try {
    const usersList = await User.find({
      created_by: req.user?.id,
      role: USER_TYPE.USER,
    }).select("-password");

    res.json({ users: usersList });
  } catch (error) {
    res.status(HTTP_STATUS_CODE.SERVER_ERROR);
    throw new Error("Server error");
  }
});

// @desc Get User By Id
// @route POST /api/users/:id
// @access private
export const getUserById = expressAsyncHandler(
  async (req: any, res: Response) => {
    const userId = req.params.id;
    if (req.user?.role !== USER_TYPE.HR) {
      res.status(HTTP_STATUS_CODE.UNAUTHORISED);
      throw new Error("Unauthorised user!");
    }

    try {
      const user = await User.findOne({
        id: userId,
        created_by: req.user?.id,
      }).select("-password");

      if (!user) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND);
        throw new Error("User Not Found.");
      }
      res.json({ user });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR);
      throw new Error("Server error");
    }
  }
);
