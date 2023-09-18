const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

app.use(express.json());

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Server error";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.get("/", (req, res) => {
  res.json("The backend server is up and running");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Backend server is running");
});

module.exports = app;
