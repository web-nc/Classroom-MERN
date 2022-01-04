import mongoose from "mongoose";

const User = new mongoose.Schema({
  studentID: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  firstname: String,
  lastname: String,
  gender: {
    type: String,
    enum: ["Nam", "Nữ", "Khác"],
  },
  changePasswordToken: String,
  isBanned: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("user", User, "user");
