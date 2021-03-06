import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import passport from "./modules/passport/index.js";
import indexRouter from "./routes/index.js";
import authRouter from "./components/auth/auth.route.js";
import userRouter from "./components/user/user.route.js";
import courseRouter from "./components/course/course.route.js";
import assignmentRouter from "./components/assignment/assignment.route.js";
import gradeRouter from "./components/grade/grade.route.js";
import reviewRouter from "./components/review/review.route.js";
import notificationRouter from "./components/notification/notification.route.js";

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

mongoose.connect(
  process.env.DATABASE_URL,
  function (err) {
    if (err) throw err;
    console.log("Connect to database successful!");
  },
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
);

const whitelist = [
  "https://midterm-classroom-app.netlify.app",
  "http://localhost:3001",
  "https://btn01-app.herokuapp.com",
];

app.use(
  cors({
    credentials: true,
    origin: [...whitelist, process.env.FRONTEND_URL],
  })
);
app.use(passport.initialize());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/user", passport.authenticate("jwt", { session: false }), userRouter);
app.use(
  "/course",
  passport.authenticate("jwt", { session: false }),
  courseRouter
);
app.use(
  "/assignment",
  passport.authenticate("jwt", { session: false }),
  assignmentRouter
);
app.use(
  "/grade",
  passport.authenticate("jwt", { session: false }),
  gradeRouter
);
app.use(
  "/review",
  passport.authenticate("jwt", { session: false }),
  reviewRouter
);
app.use(
  "/notification",
  passport.authenticate("jwt", { session: false }),
  notificationRouter
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
