const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json());

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (error) {
    return { users: [], blogs: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
  res.json({
    message: "Codomax Blog API is running",
    endpoints: [
      "POST /api/register",
      "POST /api/login",
      "POST /api/blogs",
      "GET /api/blogs"
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

    const data = readData();
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = data.users.find((user) => user.email === normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      id: Date.now().toString(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    data.users.push(user);
    writeData(data);

    return res.status(201).json({
      message: "Registration successful.",
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to register user." });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const data = readData();
    const normalizedEmail = email.trim().toLowerCase();
    const user = data.users.find((item) => item.email === normalizedEmail);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json({
      message: "Login successful.",
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to login." });
  }
});

app.post("/api/blogs", (req, res) => {
  try {
    const { title, category, content, author } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ message: "Title, category and content are required." });
    }

    const data = readData();

    const blog = {
      id: Date.now().toString(),
      title: title.trim(),
      category: category.trim(),
      content: content.trim(),
      author: author?.trim() || "Anonymous",
      createdAt: new Date().toISOString()
    };

    data.blogs.unshift(blog);
    writeData(data);

    return res.status(201).json({
      message: "Blog created successfully.",
      blog
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create blog." });
  }
});

app.get("/api/blogs", (req, res) => {
  const data = readData();
  return res.json(data.blogs);
});

app.listen(PORT, () => {
  console.log(`Codomax Blog backend running on http://localhost:${PORT}`);
});