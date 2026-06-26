import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    cashBalance: {
      type: Number,
      required: true,
      default: 100000,
      min: 0,
    },
    investedValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    marketValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalValue: {
      type: Number,
      default: 100000,
      min: 0,
    },
    realizedPnl: {
      type: Number,
      default: 0,
    },
    unrealizedPnl: {
      type: Number,
      default: 0,
    },
    dayPnl: {
      type: Number,
      default: 0,
    },
    dayPnlPercent: {
      type: Number,
      default: 0,
    },
    holdingsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED"],
      default: "ACTIVE",
    },
    lastCalculatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

portfolioSchema.index({ status: 1, updatedAt: -1 });

portfolioSchema.virtual("holdings", {
  ref: "Holding",
  localField: "_id",
  foreignField: "portfolio",
});

portfolioSchema.set("toJSON", { virtuals: true });
portfolioSchema.set("toObject", { virtuals: true });

export default mongoose.model("Portfolio", portfolioSchema);
