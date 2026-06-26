import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "SYSTEM",
        "AUTH",
        "TRADE",
        "ORDER",
        "PORTFOLIO",
        "WATCHLIST",
        "MARKET",
        "ADMIN",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [120, "Title must be at most 120 characters"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Message must be at most 1000 characters"],
    },
    entityType: {
      type: String,
      enum: ["User", "Stock", "Portfolio", "Holding", "Order", "Transaction", "Watchlist"],
      default: null,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    priority: {
      type: String,
      enum: ["LOW", "NORMAL", "HIGH", "URGENT"],
      default: "NORMAL",
    },
    channel: {
      type: String,
      enum: ["IN_APP", "EMAIL", "SMS"],
      default: "IN_APP",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { sparse: true });

export default mongoose.model("Notification", notificationSchema);
