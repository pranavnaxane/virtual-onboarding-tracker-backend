import mongoose, { Schema, Document } from "mongoose";
import { STATUS, USER_TYPE } from "../constants";

interface IUser extends Document {
  name: string;
  email: string;
  contactNumber: string;
  role: USER_TYPE;
  department: string;
  joiningDate: Date;
  hrId: mongoose.Types.ObjectId;
  status: STATUS;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true },
    contactNumber: { type: Schema.Types.String, required: true },
    role: {
      type: Schema.Types.String,
      enum: Object.values(USER_TYPE),
      default: USER_TYPE.USER,
    },
    department: { type: Schema.Types.String, required: true },
    joiningDate: { type: Schema.Types.Date, required: true },
    hrId: { type: Schema.Types.ObjectId, required: true, ref: "HRProfile" },
    status: {
      type: Schema.Types.String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },
    password: { type: Schema.Types.String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
