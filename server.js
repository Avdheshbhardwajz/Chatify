const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // Import cors

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.io

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/mywebsocketapp";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Middleware
app.use(cors()); // Apply cors middleware properly
app.use(express.json());

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// RESTful APIs
app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send("User registered");
  } catch (error) {
    res.status(400).send("Error registering user");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).send("Error logging in");
  }
});

// Socket.io Connection
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("message", (msg) => {
    // Broadcast message to all clients
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, () => console.log("Server running on port 3000"));
