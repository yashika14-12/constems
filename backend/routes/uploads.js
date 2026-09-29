const express = require("express");
const multer = require("multer");
const { parse } = require("csv-parse/sync");
const Upload = require("../models/Upload");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /api/uploads  -> save a csv file
router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please choose a csv file" });
  }
  if (!req.file.originalname.toLowerCase().endsWith(".csv")) {
    return res.status(400).json({ message: "Only .csv files are allowed" });
  }

  let columns = [];
  let rows;
  try {
    rows = parse(req.file.buffer, {
      columns: (header) => {
        columns = header.map((h) => h.trim());
        return columns;
      },
      skip_empty_lines: true,
      trim: true,
      bom: true,
    });
  } catch (err) {
    return res.status(400).json({ message: "Could not read csv: " + err.message });
  }

  if (rows.length === 0) {
    return res.status(400).json({ message: "The file has no rows" });
  }

  try {
    const doc = await Upload.create({
      fileName: req.file.originalname,
      columns,
      rows,
      rowCount: rows.length,
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Failed to save file" });
  }
});

// GET /api/uploads  -> list of files (without rows)
router.get("/", async (req, res) => {
  try {
    const list = await Upload.find({}, { rows: 0 }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Failed to load files" });
  }
});

// GET /api/uploads/:id  -> one file with its rows
router.get("/:id", async (req, res) => {
  try {
    const doc = await Upload.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "File not found" });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: "Invalid id" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Upload.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid id" });
  }
});

module.exports = router;
