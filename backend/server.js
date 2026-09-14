const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    author: { type: String, default: "Anonymous", trim: true }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Blog = mongoose.model("Blog", blogSchema);

app.get("/", (req, res) => {
  res.json({
    message: "Codomax Blog API with MongoDB is running",
    endpoints: [
      "POST /api/register",
      "POST /api/login",
      "POST /api/blogs",
      "GET /api/blogs",
      "GET /api/blogs/:id"
    ]
  });
});

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash
    });

    return res.status(201).json({
      message: "Registration successful.",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to register user." });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json({
      message: "Login successful.",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to login." });
  }
});

app.post("/api/blogs", async (req, res) => {
  try {
    const { title, category, content, author } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ message: "Title, category and content are required." });
    }

    const blog = await Blog.create({
      title: title.trim(),
      category: category.trim(),
      content: content.trim(),
      author: author?.trim() || "Anonymous"
    });

    return res.status(201).json({
      message: "Blog created successfully.",
      blog
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to create blog." });
  }
});

app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.json(blogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to retrieve blogs." });
  }
});

app.get("/api/blogs/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid blog ID." });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    return res.json(blog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to retrieve blog." });
  }
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing. Add it to backend/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Codomax Blog backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
