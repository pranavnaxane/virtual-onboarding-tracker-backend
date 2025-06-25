import mongoose, { Schema, Document } from "mongoose";
import { STATUS, USER_TYPE } from "../constants";

interface IHRProfile extends Document {
  name: string;
  designation: string;
  role: USER_TYPE;
  email: string;
  region: string;
  assignedDepartments: string[];
  isActive: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const hrProfileSchema = new Schema<IHRProfile>(
  {
    name: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true },
    designation: { type: Schema.Types.String, required: true },
    role: {
      type: Schema.Types.String,
      enum: Object.values(USER_TYPE),
      default: USER_TYPE.USER,
    },
    region: { type: Schema.Types.String, required: true },
    assignedDepartments: { type: [Schema.Types.String], required: true },
    isActive: { type: Schema.Types.Boolean, default: true },
    password: { type: Schema.Types.String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IHRProfile>("HRProfile", hrProfileSchema);
