import mongoose from "mongoose";

const holdingSchema = new mongoose.Schema(
  {
    portfolio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
      index: true,
    },
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    averageCost: {
      type: Number,
      required: true,
      min: 0,
    },
    costBasis: {
      type: Number,
      required: true,
      min: 0,
    },
    marketValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastPrice: {
      type: Number,
      default: 0,
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
    firstAcquiredAt: {
      type: Date,
      default: null,
    },
    lastUpdatedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

holdingSchema.index({ portfolio: 1, stock: 1 }, { unique: true });
holdingSchema.index({ portfolio: 1, status: 1 });

export default mongoose.model("Holding", holdingSchema);
