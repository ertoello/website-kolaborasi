import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getSuggestedConnections = async (req, res) => {
  try {
    const { page = 1, limit = 7 } = req.query; // Ambil query parameter, default page=1, limit=7
    const currentUser = await User.findById(req.user._id).select("connections");

    const suggestedUsers = await User.find({
      _id: { $ne: req.user._id, $nin: currentUser.connections },
    })
      .select("name username profilePicture headline")
      .skip((page - 1) * limit) // Lompat data sesuai halaman
      .limit(Number(limit)); // Ambil hanya 'limit' data

    const totalUsers = await User.countDocuments({
      _id: { $ne: req.user._id, $nin: currentUser.connections },
    }); // Hitung total data

    res.json({
      users: suggestedUsers,
      totalUsers, // Kirim total pengguna
      totalPages: Math.ceil(totalUsers / limit), // Hitung total halaman
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error in getSuggestedConnections controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getPublicProfile = async (req, res) => {
	try {
		const user = await User.findOne({ username: req.params.username }).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Error in getPublicProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const updateProfile = async (req, res) => {
	try {
		const allowedFields = [
			"name",
			"username",
			"headline",
			"about",
			"location",
			"profilePicture",
			"bannerImg",
			"skills",
			"experience",
			"education",
		];

		const updatedData = {};

		for (const field of allowedFields) {
			if (req.body[field]) {
				updatedData[field] = req.body[field];
			}
		}

		if (req.body.profilePicture) {
			const result = await cloudinary.uploader.upload(req.body.profilePicture);
			updatedData.profilePicture = result.secure_url;
		}

		if (req.body.bannerImg) {
			const result = await cloudinary.uploader.upload(req.body.bannerImg);
			updatedData.bannerImg = result.secure_url;
		}

		const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select(
			"-password"
		);

		res.json(user);
	} catch (error) {
		console.error("Error in updateProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query; // Ambil input pencarian dari query parameter

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    // Cari user berdasarkan nama, username, atau email dengan pencarian case-insensitive
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // "i" agar tidak case-sensitive
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in searchUsers controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID user dari URL
    const updatedData = req.body; // Data yang dikirim dari frontend

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id); // Ini akan trigger middleware otomatis

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User and related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


