const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
    author: { type: String, default: "Anonymous", trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Blog = mongoose.model("Blog", blogSchema);

function createToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
}

async function authenticateToken(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select("_id name email");

    if (!user) {
      return res.status(401).json({ message: "User account not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

app.get("/", (req, res) => {
  res.json({
    message: "Codomax Blog API with JWT authentication is running",
    endpoints: [
      "POST /api/register",
      "POST /api/login",
      "GET /api/profile",
      "GET /api/my-blogs",
      "POST /api/blogs",
      "GET /api/blogs",
      "GET /api/blogs/:id",
      "PUT /api/blogs/:id",
      "DELETE /api/blogs/:id"
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

    const token = createToken(user);

    return res.json({
      message: "Login successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to login." });
  }
});

app.get("/api/profile", authenticateToken, async (req, res) => {
  return res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});

app.post("/api/blogs", authenticateToken, async (req, res) => {
  try {
    const { title, category, content } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ message: "Title, category and content are required." });
    }

    const blog = await Blog.create({
      title: title.trim(),
      category: category.trim(),
      content: content.trim(),
      author: req.user.name,
      owner: req.user._id
    });

    return res.status(201).json({ message: "Blog created successfully.", blog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to create blog." });
  }
});

app.get("/api/blogs", async (req, res) => {
  try {
    const { search = "", category = "" } = req.query;
    const filter = {};

    if (search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { content: { $regex: search.trim(), $options: "i" } },
        { author: { $regex: search.trim(), $options: "i" } }
      ];
    }

    if (category.trim()) {
      filter.category = category.trim();
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    return res.json(blogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to retrieve blogs." });
  }
});

app.get("/api/my-blogs", authenticateToken, async (req, res) => {
  try {
    const { search = "", category = "" } = req.query;
    const filter = { owner: req.user._id };

    if (search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { content: { $regex: search.trim(), $options: "i" } }
      ];
    }

    if (category.trim()) {
      filter.category = category.trim();
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    return res.json(blogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to retrieve your blogs." });
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

app.put("/api/blogs/:id", authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid blog ID." });
    }

    const { title, category, content } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ message: "Title, category and content are required." });
    }

    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      {
        title: title.trim(),
        category: category.trim(),
        content: content.trim()
      },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found or you do not have permission to edit it." });
    }

    return res.json({ message: "Blog updated successfully.", blog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to update blog." });
  }
});

app.delete("/api/blogs/:id", authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid blog ID." });
    }

    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found or you do not have permission to delete it." });
    }

    return res.json({ message: "Blog deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to delete blog." });
  }
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing. Add it to backend/.env");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing. Add it to backend/.env");
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
