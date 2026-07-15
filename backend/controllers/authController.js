import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret_123_xyz";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret_987_abc";

export const register = async (req, res) => {
  try {
    const { email, password, name, phone, role, city, pincode } = req.body;

    if (!email || !password || !name || !phone) {
      return res.status(400).json({ error: "Email, password, name, and phone are required fields" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      phone,
      role: role || "Patient",
      city,
      pincode
    });

    await newUser.save();
    return res.status(201).json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Registration failed due to a server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required fields" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const payload = { id: user._id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

    user.refreshToken = refreshToken;
    await user.save();

    // Set HttpOnly cookie for refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        city: user.city,
        pincode: user.pincode
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed due to a server error" });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token is required" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ error: "Invalid or expired refresh token" });
    }

    jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired refresh token" });
      }

      const payload = { id: user._id, email: user.email, role: user.role };
      const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });

      return res.status(200).json({ accessToken });
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return res.status(500).json({ error: "Token refresh failed due to a server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Logout failed due to a server error" });
  }
};
