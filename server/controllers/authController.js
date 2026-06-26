import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { AppError, asyncHandler } from "../middleware/errorMiddleware.js";

const buildAuthPayload = (user) => ({
  _id: user._id,
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  balance: user.balance,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    throw new AppError("Username, email and password are required.", 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: username.trim() }],
  });

  if (existingUser) {
    throw new AppError("User already exists.", 400);
  }

  const user = await User.create({
    username: username.trim(),
    email: normalizedEmail,
    password,
    role: role === "ADMIN" ? "ADMIN" : "TRADER",
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully.",
    token: generateToken(user._id),
    user: buildAuthPayload(user),
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required.", 400);
  }

  const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select(
    "+password",
  );

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401);
  }

  res.status(200).json({
    success: true,
    message: "Login successful.",
    token: generateToken(user._id),
    user: buildAuthPayload(user),
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
});
