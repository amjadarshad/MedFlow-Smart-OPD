import Notification from "../models/Notification.js";

export async function createNotification({
  recipient,
  type,
  message,
  link,
  relatedAppointment,
}) {
  try {
    return await Notification.create({
      recipient,
      type,
      message,
      link,
      relatedAppointment,
    });
  } catch (error) {
    console.error("Unable to create notification:", error.message);
    return null;
  }
}
