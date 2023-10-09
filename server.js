const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
// const socketIO = require("socket.io");
const http = require("http");
const server = http.createServer(app);
// const io = socketIO(server);
const mongoose = require("mongoose");
dotenv.config();

// routes
const userauthroute = require("./src/routes/user/auth");
const userusersroute = require("./src/routes/user/user");
const vendorauthroute = require("./src/routes/vendor/auth");

app.use(express.json());
// app.use(
//   cors({
//     origin: "http://192.168.0.4:19000",
//   })
// );
// app.use((err, req, res, next) => {
//   const status = err.status || 500;
//   const message = err.message || "Server error";
//   return res.status(status).json({
//     success: false,
//     status,
//     message,
//   });
// });
app.use("/api/userapp/auth", userauthroute);
app.use("/api/userapp/users", userusersroute);
app.use("/api/vendorapp/auth", vendorauthroute);

// Handle incoming socket connections
// io.on("connection", (socket) => {
//   console.log("A user connected");

//   // Handle chat messages
//   socket.on("chat message", (msg) => {
//     // Broadcast the message to all connected clients
//     io.emit("chat message", msg);
//   });

//   // Handle user disconnection
//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });

// API endpoint to send a chat message
// app.post("/api/sendMessage", (req, res) => {
//   const { message } = req.body;

//   // Emit the message to all connected clients
//   io.emit("chat message", message);

//   res.status(200).json({ success: true, message: "Message sent successfully" });
// });

app.get("/", (req, res) => {
  res.json("The backend server is up and running");
});

const connect = async () => {
  mongoose.set("strictQuery", false);
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    app.listen(port, () => {
      console.log("Backend server is running");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const port = process.env.PORT || 5000;

connect();

// app.listen(port, () => {
//   connect();
//   console.log("Backend server is running");
// });

module.exports = app;
