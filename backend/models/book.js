const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    desc: { type: String, required: true },
    language: { type: String, required: true },
    standard: { type: String, required: true }, // <-- Added
    status: {
      type: String,
      enum: ["available", "sold", "unavailable"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
