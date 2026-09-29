const mongoose = require("mongoose");

// one document per uploaded file, rows are kept as plain objects
const uploadSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    columns: [String],
    rows: [mongoose.Schema.Types.Mixed],
    rowCount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upload", uploadSchema);
