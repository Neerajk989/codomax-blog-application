const API_BASE_URL = "http://localhost:5000/api";

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

async function fetchBlogs() {
  const response = await fetch(`${API_BASE_URL}/blogs`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not load blogs.");
  }

  return data;
}

async function renderPosts(id) {
  const target = document.getElementById(id);
  if (!target) return;

  try {
    const posts = await fetchBlogs();

    if (!posts.length) {
      target.innerHTML = '<div class="empty-state">No blogs in MongoDB yet. Create your first blog from the dashboard.</div>';
    } else {
      target.innerHTML = posts.map((post) => `
        <article class="blog-card">
          <span class="category">${safe(post.category)}</span>
          <h3>${safe(post.title)}</h3>
          <p>${safe(post.content).slice(0, 180)}${post.content.length > 180 ? "..." : ""}</p>
          <div class="blog-meta">
            <small>By ${safe(post.author || "Anonymous")} · ${new Date(post.createdAt).toLocaleDateString()}</small>
            <a class="read-more" href="blog-detail.html?id=${encodeURIComponent(post._id)}">Read More →</a>
          </div>
        </article>
      `).join("");
    }

    const total = document.getElementById("totalPosts");
    const published = document.getElementById("publishedPosts");

    if (total) total.textContent = posts.length;
    if (published) published.textContent = posts.length;
  } catch (error) {
    target.innerHTML = '<div class="empty-state">Unable to load blogs. Make sure the backend and MongoDB connection are running.</div>';
  }
}

async function loadBlogDetail() {
  const target = document.getElementById("blogDetail");
  if (!target) return;

  const params = new URLSearchParams(window.location.search);
  const blogId = params.get("id");

  if (!blogId) {
    target.innerHTML = "<h2>Blog not found</h2><p>No blog ID was provided.</p>";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${encodeURIComponent(blogId)}`);
    const blog = await response.json();

    if (!response.ok) {
      throw new Error(blog.message || "Blog not found.");
    }

    target.innerHTML = `
      <span class="category">${safe(blog.category)}</span>
      <h1>${safe(blog.title)}</h1>
      <p class="detail-meta">By ${safe(blog.author || "Anonymous")} · ${new Date(blog.createdAt).toLocaleString()}</p>
      <div class="blog-content">${safe(blog.content).replace(/\n/g, "<br>")}</div>
    `;
  } catch (error) {
    target.innerHTML = `<h2>Unable to load blog</h2><p>${safe(error.message)}</p>`;
  }
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
    message.textContent = "Backend server is not running or MongoDB is not connected.";
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
    message.textContent = "Backend server is not running or MongoDB is not connected.";
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

    message.textContent = "Blog saved to MongoDB successfully!";
    event.target.reset();

    setTimeout(() => {
      location.href = `blog-detail.html?id=${encodeURIComponent(data.blog._id)}`;
    }, 700);
  } catch (error) {
    message.textContent = "Backend server is not running or MongoDB is not connected.";
  }
});

const currentUser = JSON.parse(localStorage.getItem("codomaxUser") || "null");
const welcome = document.getElementById("welcomeText");

if (welcome && currentUser) {
  welcome.textContent = `Welcome, ${currentUser.name}. Manage your MongoDB-powered blog posts.`;
}

renderPosts("blogGrid");
renderPosts("dashboardPosts");
loadBlogDetail();
