// CommonJS (CJS)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const app = express();
const server = http.createServer(app);

// ------------- initiallize io ---------------
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// --------------  Middleware setup ------------------
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(mongoSanitize());

// --------Make io accessible in controllers --------------
app.set("io", io);

// ----------------------- Backend Server Testing ----------------
app.get("/api/status", (req, res) => {
  res.send("Server is live");
});

// --------------- Routes Setup -----------------
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ------------------Socket.io connection handler --------------------
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// --------------- Mongo Connection -----------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err.message);
  });
