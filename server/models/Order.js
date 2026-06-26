import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
      index: true,
    },
    portfolio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      default: null,
    },
    orderType: {
      type: String,
      enum: ["INTRADAY", "DELIVERY"],
      required: true,
    },
    action: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    filledQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    limitPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    stopPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "CANCELLED", "REJECTED"],
      default: "PENDING",
    },
    timeInForce: {
      type: String,
      enum: ["DAY", "GTC", "IOC", "FOK"],
      default: "DAY",
    },
    side: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },
    orderKind: {
      type: String,
      enum: ["MARKET", "LIMIT", "STOP", "STOP_LIMIT"],
      default: "MARKET",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ stock: 1, status: 1, createdAt: -1 });
orderSchema.index({ portfolio: 1, status: 1 });

export default mongoose.model("Order", orderSchema);
