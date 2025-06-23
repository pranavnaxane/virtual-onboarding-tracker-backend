import mongoose, { Schema, Document } from "mongoose";
import { USER_TYPE } from "../constants";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: USER_TYPE.HR | USER_TYPE.USER;
  created_by: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: Schema.Types.String, required: true },
    name: { type: Schema.Types.String, required: true },
    password: { type: Schema.Types.String, required: true },
    role: {
      type: Schema.Types.String,
      enum: [USER_TYPE.HR, USER_TYPE.USER],
      default: USER_TYPE.USER,
    },
    created_by: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
