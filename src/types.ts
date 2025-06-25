import { Request, Response } from "express";
import mongoose from "mongoose";
export interface AppRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export interface UserProfileType {
  userId: string;
  name: string;
  email: string;
  contactNumber: string;
  role: string;
  department: string;
  joiningDate: Date;
  hrId: mongoose.Types.ObjectId;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HRProfileType {
  hrId: string;
  name: string;
  designation: string;
  role: string;
  email: string;
  region: string;
  assignedDepartments: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
