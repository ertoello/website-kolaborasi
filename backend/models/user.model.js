import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nik: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true},
    password: { type: String, required: true },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    profilePicture: {
      type: String,
      default: "",
    },
    bannerImg: {
      type: String,
      default: "",
    },
    headline: {
      type: String,
      default: "Pengguna Baru",
    },
    location: {
      type: String,
      default: "Earth",
    },
    about: {
      type: String,
      default: "",
    },
    skills: [String],
    experience: [
      {
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        school: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
      },
    ],
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// ✅ Middleware diletakkan SETELAH schema didefinisikan
userSchema.pre("findOneAndDelete", async function (next) {
  const userId = this.getQuery()["_id"];
  const Post = (await import("./Post.js")).default;
  const Message = (await import("./Message.js")).default;
  const Notification = (await import("./Notification.js")).default;
  const ConnectionRequest = (await import("./ConnectionRequest.js")).default;
  const User = (await import("./User.js")).default;

  try {
    await Post.deleteMany({ author: userId });

    await Post.updateMany(
      { "comments.user": userId },
      { $pull: { comments: { user: userId } } }
    );

    await Post.updateMany({ likes: userId }, { $pull: { likes: userId } });

    await Message.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    await ConnectionRequest.deleteMany({
      $or: [{ sender: userId }, { recipient: userId }],
    });

    await Notification.deleteMany({
      $or: [{ recipient: userId }, { relatedUser: userId }],
    });

    await User.updateMany(
      { connections: userId },
      { $pull: { connections: userId } }
    );

    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
