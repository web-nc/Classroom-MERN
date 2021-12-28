import mongoose from "mongoose";

const Notification = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
  type: {
    type: String,
    enum: [
      "grade_published",
      "review_comment",
      "grade_reviewed",
      "grade_edit",
      "request_review",
    ],
  },
  linkTo: String,
  createdAt: Date,
});

export default mongoose.model("notification", Notification, "notification");
