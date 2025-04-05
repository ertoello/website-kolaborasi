import Notification from "../models/notification.model.js";

export const getUserNotifications = async (req, res) => {
	try {
		const notifications = await Notification.find({ recipient: req.user._id })
			.sort({ createdAt: -1 })
			.populate("relatedUser", "name username profilePicture")
			.populate("relatedPost", "content image");

		res.status(200).json(notifications);
	} catch (error) {
		console.error("Error in getUserNotifications controller:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const markNotificationAsRead = async (req, res) => {
	const notificationId = req.params.id;
	try {
		const notification = await Notification.findByIdAndUpdate(
			{ _id: notificationId, recipient: req.user._id },
			{ read: true },
			{ new: true }
		);

		res.json(notification);
	} catch (error) {
		console.error("Error in markNotificationAsRead controller:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteNotification = async (req, res) => {
	const notificationId = req.params.id;

	try {
		await Notification.findOneAndDelete({
			_id: notificationId,
			recipient: req.user._id,
		});

		res.json({ message: "Notification deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

export const countUnreadMessages = async (req, res) => {
  try {
    const recipientId = req.user._id;

    // Ambil semua pengirim unik dari notifikasi yang belum dibaca
    const distinctSenders = await Notification.distinct("relatedUser", {
      recipient: recipientId,
      type: "message",
      read: false,
    });

    res.status(200).json({ count: distinctSenders.length });
  } catch (error) {
    console.error("Error in countUnreadMessages controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markMessageNotificationAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;

    await Notification.updateMany(
      {
        recipient: req.user._id,
        type: "message",
        relatedUser: senderId,
        read: false,
      },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "Message notifications marked as read" });
  } catch (error) {
    console.error("Error in markMessageNotificationAsRead controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const countUnreadMessagesFromSender = async (req, res) => {
  try {
    const recipientId = req.user._id;
    const senderId = req.params.senderId;

    // Hitung jumlah notifikasi yang belum dibaca dari sender tertentu
    const count = await Notification.countDocuments({
      recipient: recipientId,
      relatedUser: senderId,
      type: "message",
      read: false,
    });

    res.status(200).json({ senderId, count });
  } catch (error) {
    console.error("Error in countUnreadMessagesFromSender controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
