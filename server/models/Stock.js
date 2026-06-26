import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    exchange: {
      type: String,
      required: true,
      trim: true,
    },
    currency: {
      type: String,
      enum: ["USD"],
      default: "USD",
    },
    marketCap: {
      type: Number,
      required: [true, "Market cap is required"],
      min: [0, "Market cap cannot be negative"],
      index: true,
    },
    sharesOutstanding: {
      type: Number,
      default: null,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description must be at most 2000 characters"],
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    change: {
      type: Number,
      default: 0,
    },
    changePercent: {
      type: Number,
      default: 0,
    },
    sector: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "HALTED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

stockSchema.index({ symbol: 1 }, { unique: true });
stockSchema.index({ name: "text", symbol: "text" });
stockSchema.index({ exchange: 1, symbol: 1 });
stockSchema.index({ sector: 1, marketCap: 1 });
stockSchema.index({ status: 1, updatedAt: -1 });

export default mongoose.model("Stock", stockSchema);
