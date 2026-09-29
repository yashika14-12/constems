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

app.use("/api/uploads", uploadRoutes);

// on vercel the app is exported and mongoose queues queries until the connection is ready
const connection = mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });

if (require.main === module) {
  connection
    .then(() => {
      console.log("mongo connected");
      app.listen(PORT, () => console.log(`server running on port ${PORT}`));
    })
    .catch((err) => {
      console.log("could not connect to mongo at " + MONGO_URI);
      console.log("make sure mongodb is running. error:", err.message);
      process.exit(1);
    });
} else {
  connection.catch((err) => console.log("could not connect to mongo:", err.message));
}

module.exports = app;
