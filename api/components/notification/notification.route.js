import express from "express";
import notificationController from "./notification.controller.js";

const router = express.Router();

router.get("/", notificationController.getNotifications);

router.post("/", notificationController.createNotification);

export default router;
