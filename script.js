const API_BASE_URL = "http://localhost:5000/api";

const starterPosts = [
  {
    title: "Getting Started with Web Development",
    category: "Web Development",
    content: "HTML gives structure, CSS controls presentation and JavaScript adds interaction.",
    date: "Day 1"
  },
  {
    title: "Why Responsive Design Matters",
    category: "Technology",
    content: "Responsive design helps websites adapt smoothly to phones, tablets and desktops.",
    date: "Day 2"
  },
  {
    title: "My Codomax Internship Journey",
    category: "Learning",
    content: "This project is part of my Full Stack Web Development internship task at Codomax.",
    date: "Day 4"
  }
];

function safe(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

async function fetchBlogs() {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs`);
    if (!response.ok) throw new Error("Could not load blogs");
    const backendBlogs = await response.json();

    const formattedBlogs = backendBlogs.map((blog) => ({
      title: blog.title,
      category: blog.category,
      content: blog.content,
      date: new Date(blog.createdAt).toLocaleDateString()
    }));

    return [...formattedBlogs, ...starterPosts];
  } catch (error) {
    return starterPosts;
  }
}

async function renderPosts(id) {
  const target = document.getElementById(id);
  if (!target) return;

  const posts = await fetchBlogs();

  target.innerHTML = posts.map((post) => `
    <article class="blog-card">
      <span class="category">${safe(post.category)}</span>
      <h3>${safe(post.title)}</h3>
      <p>${safe(post.content).slice(0, 180)}</p>
      <small>${safe(post.date || "Published")}</small>
    </article>
  `).join("");

  const total = document.getElementById("totalPosts");
  const published = document.getElementById("publishedPosts");

  if (total) total.textContent = posts.length;
  if (published) published.textContent = posts.length;
}

document.getElementById("registerForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = document.getElementById("registerMessage");
  message.textContent = "Creating account...";

  const payload = {
    name: document.getElementById("registerName").value.trim(),
    email: document.getElementById("registerEmail").value.trim(),
    password: document.getElementById("registerPassword").value
  };

  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.message || "Registration failed.";
      return;
    }

    message.textContent = "Registration successful! Redirecting to login...";
    setTimeout(() => {
      location.href = "login.html";
    }, 800);
  } catch (error) {
    message.textContent = "Backend server is not running. Start it on port 5000.";
  }
});

document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = document.getElementById("loginMessage");
  message.textContent = "Logging in...";

  const payload = {
    email: document.getElementById("loginEmail").value.trim(),
    password: document.getElementById("loginPassword").value
  };

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.message || "Login failed.";
      return;
    }

    localStorage.setItem("codomaxUser", JSON.stringify(data.user));
    message.textContent = "Login successful!";

    setTimeout(() => {
      location.href = "dashboard.html";
    }, 700);
  } catch (error) {
    message.textContent = "Backend server is not running. Start it on port 5000.";
  }
});

document.getElementById("blogForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = document.getElementById("blogMessage");
  message.textContent = "Publishing blog...";

  const user = JSON.parse(localStorage.getItem("codomaxUser") || "null");

  const payload = {
    title: document.getElementById("blogTitle").value.trim(),
    category: document.getElementById("blogCategory").value,
    content: document.getElementById("blogContent").value.trim(),
    author: user?.name || "Anonymous"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.message || "Could not publish blog.";
      return;
    }

    message.textContent = "Blog published successfully!";
    event.target.reset();

    setTimeout(() => {
      location.href = "dashboard.html";
    }, 800);
  } catch (error) {
    message.textContent = "Backend server is not running. Start it on port 5000.";
  }
});

const currentUser = JSON.parse(localStorage.getItem("codomaxUser") || "null");
const welcome = document.getElementById("welcomeText");

if (welcome && currentUser) {
  welcome.textContent = `Welcome, ${currentUser.name}. Manage your posts and keep writing.`;
}

renderPosts("blogGrid");
renderPosts("dashboardPosts");
