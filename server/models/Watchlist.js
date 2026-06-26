import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Watchlist name must be at least 2 characters"],
      maxlength: [80, "Watchlist name must be at most 80 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [250, "Description must be at most 250 characters"],
      default: "",
    },
    stocks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock",
      },
    ],
    isDefault: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED"],
      default: "ACTIVE",
    },
    lastOpenedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

watchlistSchema.index({ user: 1, name: 1 }, { unique: true });
watchlistSchema.index({ user: 1, isDefault: 1 });
watchlistSchema.index({ user: 1, status: 1, updatedAt: -1 });

export default mongoose.model("Watchlist", watchlistSchema);
