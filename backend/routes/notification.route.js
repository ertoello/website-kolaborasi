import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  deleteNotification,
  getUserNotifications,
  markNotificationAsRead,
  countUnreadMessages,
  markMessageNotificationAsRead,
  countUnreadMessagesFromSender,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUserNotifications);

router.put("/:id/read", protectRoute, markNotificationAsRead);
router.delete("/:id", protectRoute, deleteNotification);
router.get("/count/message", protectRoute, countUnreadMessages);
router.get(
  "/messages/unread-count/:senderId",
  protectRoute,
  countUnreadMessagesFromSender
);
router.put(
  "/message/read/:senderId",
  protectRoute,
  markMessageNotificationAsRead
);


export default router;
