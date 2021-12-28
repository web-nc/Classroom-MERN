import express from "express";
import courseController from "./course.controller.js";

const router = express.Router();

router.get("/", courseController.getCourses);

router.get("/:id", courseController.getOneCourse);

router.get("/public/:id", courseController.getPublicInfoCourse);

router.post("/", courseController.createCourse);

router.post("/join", courseController.userJoinCourse);

router.post("/invite/teacher", courseController.sendTeacherEmail);

router.post("/invite/student", courseController.sendStudentEmail);

router.put("/:id", courseController.updateOneCourse);

router.put("/:id/gradeboard", courseController.updateGradeBoard);

router.delete("/:id", courseController.deleteOneCourse);

router.post("/leaveCourse", courseController.leaveCourse);

export default router;
