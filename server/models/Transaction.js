import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      immutable: true,
    },
    portfolio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      default: null,
      index: true,
      immutable: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
      index: true,
      immutable: true,
    },
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      default: null,
      index: true,
      immutable: true,
    },
    type: {
      type: String,
      enum: ["DEPOSIT", "WITHDRAWAL", "BUY", "SELL", "DIVIDEND", "FEE", "ADJUSTMENT"],
      required: true,
      immutable: true,
    },
    amount: {
      type: Number,
      default: 0,
      min: 0,
      immutable: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
      immutable: true,
    },
    unitPrice: {
      type: Number,
      default: 0,
      min: 0,
      immutable: true,
    },
    grossAmount: {
      type: Number,
      default: 0,
      min: 0,
      immutable: true,
    },
    fees: {
      type: Number,
      default: 0,
      min: 0,
      immutable: true,
    },
    balanceBefore: {
      type: Number,
      default: 0,
      min: 0,
      immutable: true,
    },
    balanceAfter: {
      type: Number,
      default: 0,
      min: 0,
      immutable: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
      default: "COMPLETED",
      immutable: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes must be at most 500 characters"],
      default: "",
      immutable: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ portfolio: 1, createdAt: -1 });
transactionSchema.index({ type: 1, status: 1, createdAt: -1 });

export default mongoose.model("Transaction", transactionSchema);
