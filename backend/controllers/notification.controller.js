import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

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

export const createPostNotificationForAllUsers = async (post, category) => {
  try {
    // Ambil semua user kecuali pembuat post
    const users = await User.find({ _id: { $ne: post.author } });

    // Siapkan array notifikasi
    const notifications = users.map((user) => ({
      recipient: user._id,
      type: "post",
      relatedUser: post.author,
      relatedPost: post._id,
      read: false,
    }));

    // Simpan semua notifikasi
    await Notification.insertMany(notifications);
    console.log(
      `Notifikasi untuk kategori "${category}" berhasil dikirim ke semua user`
    );
  } catch (error) {
    console.error("Error saat membuat notifikasi post:", error);
  }
};

export const countUnreadPostNotificationsByCategory = async (req, res) => {
  try {
    const recipientId = req.user._id;

    const unreadNotifications = await Notification.find({
      recipient: recipientId,
      type: "post",
      read: false,
    }).populate("relatedPost", "category");

    const counts = {
      all: unreadNotifications.length,
      penting: 0,
      kolaborasi: 0,
    };

    unreadNotifications.forEach((notif) => {
      const category = notif.relatedPost?.category;

      if (category === "penting") counts.penting += 1;
      else if (category === "kolaborasi") counts.kolaborasi += 1;
    });

    res.status(200).json(counts);
  } catch (error) {
    console.error("Error in countUnreadPostNotificationsByCategory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markPostNotificationsByCategoryAsRead = async (req, res) => {
  try {
    const recipientId = req.user._id;
    const { category } = req.body;

    // Ambil semua notification yang belum dibaca dan tipe 'post'
    const unreadNotifs = await Notification.find({
      recipient: recipientId,
      type: "post",
      read: false,
    }).populate("relatedPost", "category");

    // Ambil ID notifikasi yang relatedPost.category sesuai permintaan
    const toMarkAsReadIds = unreadNotifs
      .filter((notif) => notif.relatedPost?.category === category)
      .map((notif) => notif._id);

    if (toMarkAsReadIds.length === 0) {
      return res
        .status(200)
        .json({
          message: "Tidak ada notifikasi yang perlu ditandai sebagai dibaca.",
        });
    }

    // Update semua notifikasi tersebut
    await Notification.updateMany(
      { _id: { $in: toMarkAsReadIds } },
      { $set: { read: true } }
    );

    res.status(200).json({
      message: `Semua notifikasi kategori "${category}" telah ditandai sebagai dibaca.`,
      count: toMarkAsReadIds.length,
    });
  } catch (error) {
    console.error("Error in markPostNotificationsByCategoryAsRead:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



