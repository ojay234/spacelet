import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Enter Email Field"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Enter Password Field"],
  },
},
  {
    timestamps: true,
  }
);

export default model<IUser>("User", userSchema);
