import Notification from "./notification.model.js";

export default {
  getNotifications: async (req, res) => {
    const userId = req.user._id;

    Notification.find({ userId: userId })
      .sort("order")
      .exec(async (e, notifications) => {
        if (e) {
          return res.status(500).json({ message: e });
        }
        return res.status(200).json({ notifications: notifications });
      });
  },

  createNotification: async (req, res) => {
    const { receiverID, notification } = req.body.data;
    Notification.create(
      {
        userId: receiverID,
        title: notification.title,
        description: notification.description,
        type: notification.type,
        linkTo: notification.linkTo,
        createdAt: notification.createdAt,
      },
      (e, notification) => {
        if (e) {
          return res.status(500).json({ message: e });
        }
        res.status(200).json({ notification });
      }
    );
  },
};
