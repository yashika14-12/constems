require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const uploadRoutes = require("./routes/uploads");

const app = express();
const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/csv_viewer";

app.use(cors());
app.use(express.json());

// connect once and reuse it; if connecting fails, the next request tries again
let connection = null;
function connectDb() {
  if (!connection) {
    connection = mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 }).catch((err) => {
      connection = null;
      throw err;
    });
  }
  return connection;
}

app.use("/api", async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (err) {
    console.log("could not connect to mongo:", err.message);
    res.status(503).json({ message: "Database is not reachable, please try again" });
  }
});

app.use("/api/uploads", uploadRoutes);

if (require.main === module) {
  connectDb()
    .then(() => {
      console.log("mongo connected");
      app.listen(PORT, () => console.log(`server running on port ${PORT}`));
    })
    .catch((err) => {
      console.log("could not connect to mongo at " + MONGO_URI);
      console.log("make sure mongodb is running. error:", err.message);
      process.exit(1);
    });
}

module.exports = app;
