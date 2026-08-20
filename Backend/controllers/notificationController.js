import mongoose from "mongoose";

import Notification from "../models/Notification.js";

export async function getMyNotifications(req, res) {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to load notifications.",
      error: error.message,
    });
  }
}

export async function markNotificationAsRead(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid notification ID.",
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      recipient: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({ notification });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to mark notification as read.",
      error: error.message,
    });
  }
}

export async function markAllNotificationsAsRead(req, res) {
  try {
    await Notification.updateMany(
      {
        recipient: req.user.id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    return res.status(200).json({
      message: "All notifications marked as read.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to mark all notifications as read.",
      error: error.message,
    });
  }
}
