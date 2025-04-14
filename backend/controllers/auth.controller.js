import User from "../models/user.model.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";

// export const signup = async (req, res) => {
//   try {
//     const { name, username, email, password, nik } = req.body;

//     if (!name || !username || !email || !password || !nik) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingEmail = await User.findOne({ email });
//     if (existingEmail) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     const existingUsername = await User.findOne({ username });
//     if (existingUsername) {
//       return res.status(400).json({ message: "Username already exists" });
//     }

//     if (password.length < 6) {
//       return res
//         .status(400)
//         .json({ message: "Password must be at least 6 characters" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const verificationToken = Math.floor(
//       100000 + Math.random() * 900000
//     ).toString();

//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       username,
//       nik,
//       isApproved: false,
//       verificationToken,
//       verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
//       connections: [], // Inisialisasi array koneksi
//     });

//     await user.save();

//     // 🔁 Tambahkan koneksi otomatis ke semua user yang memiliki role "admin"
//     const adminUsers = await User.find({ role: "admin" });

//     if (adminUsers.length > 0) {
//       adminUsers.forEach(async (admin) => {
//         // Tambahkan user baru ke koneksi admin, dan sebaliknya
//         if (!user.connections.includes(admin._id)) {
//           user.connections.push(admin._id);
//         }
//         if (!admin.connections.includes(user._id)) {
//           admin.connections.push(user._id);
//           await admin.save(); // simpan perubahan admin
//         }
//       });

//       await user.save(); // simpan perubahan user setelah loop selesai
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "3d",
//     });

//     await sendVerificationEmail(user.email, verificationToken);

//     res.cookie("jwt-linkedin", token, {
//       httpOnly: true,
//       maxAge: 3 * 24 * 60 * 60 * 1000,
//       sameSite: "strict",
//       secure: process.env.NODE_ENV === "production",
//     });

//     res.status(201).json({
//       success: true,
//       message: "User created successfully. Please verify your email.",
//       user: { ...user._doc, password: undefined },
//     });
//   } catch (error) {
//     console.error("Error in signup: ", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const signup = async (req, res) => {
  try {
    const { name, username, email, password, nik } = req.body;

    if (!name || !username || !email || !password || !nik) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      username,
      nik,
      isApproved: false,
      isVerified: true, // ✅ Langsung dianggap sudah diverifikasi
      verificationToken: null,
      verificationTokenExpiresAt: null,
      connections: [],
    });

    await user.save();

    // 🔁 Tambahkan koneksi otomatis ke semua admin
    const adminUsers = await User.find({ role: "admin" });

    if (adminUsers.length > 0) {
      for (const admin of adminUsers) {
        if (!user.connections.includes(admin._id)) {
          user.connections.push(admin._id);
        }
        if (!admin.connections.includes(user._id)) {
          admin.connections.push(user._id);
          await admin.save();
        }
      }

      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("jwt-linkedin", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error("Error in signup: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isApproved = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User approved successfully",
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    console.error("Error in approveUser: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    }); 

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // Kirim email selamat datang setelah verifikasi berhasil
    const profileUrl = `${process.env.CLIENT_URL}/profile/${user.username}`;
    await sendWelcomeEmail(user.email, user.name, profileUrl);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in verifyEmail: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Cek apakah user ada di database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Cek apakah akun sudah diverifikasi
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Anda belum melakukan Verifikasi Email. Periksa Email Anda untuk melanjutkan." });
    }

    // Cek apakah akun sudah disetujui oleh admin
    if (!user.isApproved) {
      return res
        .status(403)
        .json({
          message: "Akun anda belum diverifikasi oleh admin. Silahkan tunggu.",
        });
    }

    // Cek kecocokan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Buat token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // Set cookie dengan token
    res.cookie("jwt-linkedin", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 hari
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Perbarui waktu login terakhir
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        isApproved: user.isApproved,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    // Hapus semua cookie dengan mengulang setiap cookie dalam request
    Object.keys(req.cookies).forEach((cookie) => {
      res.clearCookie(cookie, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getCurrentUser = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		console.error("Error in getCurrentUser controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Password reset link sent to your email",
      });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

