const API_BASE_URL = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? "http://localhost:5000/api" : "/api";
const TOKEN_KEY = "codomaxToken";
const USER_KEY = "codomaxUser";

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

function authHeaders(extra = {}) {
  const token = getToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  location.href = "login.html";
}

async function verifyAuthentication() {
  const privatePages = ["dashboard.html", "create-blog.html", "edit-blog.html", "profile.html"];
  const currentPage = location.pathname.split("/").pop() || "index.html";

  if (!privatePages.includes(currentPage)) return true;

  const token = getToken();
  if (!token) {
    location.href = "login.html";
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: authHeaders()
    });

    if (!response.ok) {
      logout();
      return false;
    }

    const data = await response.json();
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return true;
  } catch {
    return true;
  }
}

async function fetchBlogs(search = "", category = "", mine = false) {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  if (category.trim()) params.set("category", category.trim());

  const endpoint = mine ? "my-blogs" : "blogs";
  const query = params.toString() ? `?${params.toString()}` : "";

  const response = await fetch(`${API_BASE_URL}/${endpoint}${query}`, {
    headers: mine ? authHeaders() : {}
  });

  const data = await response.json();

  if (response.status === 401 && mine) {
    logout();
    throw new Error("Session expired.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Could not load blogs.");
  }

  return data;
}

async function renderPosts(id, options = {}) {
  const target = document.getElementById(id);
  if (!target) return;

  const search = options.search ?? document.getElementById("searchBlogs")?.value ?? "";
  const category = options.category ?? document.getElementById("categoryFilter")?.value ?? "";
  const dashboardMode = id === "dashboardPosts";

  try {
    const posts = await fetchBlogs(search, category, dashboardMode);

    if (!posts.length) {
      target.innerHTML = dashboardMode
        ? '<div class="empty-state">You have not created any matching blogs yet.</div>'
        : '<div class="empty-state">No matching blogs found.</div>';
    } else {
      target.innerHTML = posts.map((post) => `
        <article class="blog-card">
          <span class="category">${safe(post.category)}</span>
          <h3>${safe(post.title)}</h3>
          <p>${safe(post.content).slice(0, 180)}${post.content.length > 180 ? "..." : ""}</p>
          <div class="blog-meta">
            <small>By ${safe(post.author || "Anonymous")} · ${new Date(post.createdAt).toLocaleDateString()}</small>
            <div class="card-actions">
              <a class="read-more" href="blog-detail.html?id=${encodeURIComponent(post._id)}">Read More</a>
              ${dashboardMode ? `
                <a class="action-link edit" href="edit-blog.html?id=${encodeURIComponent(post._id)}">Edit</a>
                <button class="action-link delete" type="button" onclick="deleteBlog('${safe(post._id)}')">Delete</button>
              ` : ""}
            </div>
          </div>
        </article>
      `).join("");
    }

    const total = document.getElementById("totalPosts");
    const published = document.getElementById("publishedPosts");
    if (total) total.textContent = posts.length;
    if (published) published.textContent = posts.length;
  } catch (error) {
    target.innerHTML = `<div class="empty-state">${safe(error.message)}</div>`;
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

    const currentUser = getCurrentUser();
    const isOwner = currentUser && String(blog.owner) === String(currentUser.id);

    target.innerHTML = `
      <span class="category">${safe(blog.category)}</span>
      <h1>${safe(blog.title)}</h1>
      <p class="detail-meta">By ${safe(blog.author || "Anonymous")} · ${new Date(blog.createdAt).toLocaleString()}</p>
      <div class="blog-content">${safe(blog.content).replace(/\n/g, "<br>")}</div>
      ${isOwner ? `
        <div class="detail-actions">
          <a class="btn" href="edit-blog.html?id=${encodeURIComponent(blog._id)}">Edit Blog</a>
          <button class="btn danger" type="button" onclick="deleteBlog('${safe(blog._id)}', true)">Delete Blog</button>
        </div>
      ` : ""}
    `;
  } catch (error) {
    target.innerHTML = `<h2>Unable to load blog</h2><p>${safe(error.message)}</p>`;
  }
}

async function loadEditBlog() {
  const form = document.getElementById("editBlogForm");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const blogId = params.get("id");
  const message = document.getElementById("editBlogMessage");

  if (!blogId) {
    message.textContent = "No blog ID provided.";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${encodeURIComponent(blogId)}`);
    const blog = await response.json();

    if (!response.ok) {
      throw new Error(blog.message || "Blog not found.");
    }

    const currentUser = getCurrentUser();
    if (!currentUser || String(blog.owner) !== String(currentUser.id)) {
      message.textContent = "You can edit only your own blogs.";
      form.querySelector("button[type='submit']").disabled = true;
      return;
    }

    document.getElementById("editBlogTitle").value = blog.title;
    document.getElementById("editBlogCategory").value = blog.category;
    document.getElementById("editBlogContent").value = blog.content;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      message.textContent = "Updating blog...";

      const payload = {
        title: document.getElementById("editBlogTitle").value.trim(),
        category: document.getElementById("editBlogCategory").value,
        content: document.getElementById("editBlogContent").value.trim()
      };

      const updateResponse = await fetch(`${API_BASE_URL}/blogs/${encodeURIComponent(blogId)}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload)
      });

      const updateData = await updateResponse.json();

      if (updateResponse.status === 401) {
        logout();
        return;
      }

      if (!updateResponse.ok) {
        message.textContent = updateData.message || "Update failed.";
        return;
      }

      message.textContent = "Blog updated successfully!";
      setTimeout(() => {
        location.href = `blog-detail.html?id=${encodeURIComponent(blogId)}`;
      }, 700);
    });
  } catch (error) {
    message.textContent = error.message;
  }
}

async function deleteBlog(blogId, fromDetail = false) {
  const confirmed = window.confirm("Are you sure you want to delete this blog?");
  if (!confirmed) return;

  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${encodeURIComponent(blogId)}`, {
      method: "DELETE",
      headers: authHeaders()
    });

    const data = await response.json();

    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok) {
      alert(data.message || "Could not delete blog.");
      return;
    }

    alert("Blog deleted successfully.");

    if (fromDetail) {
      location.href = "dashboard.html";
    } else {
      renderPosts("dashboardPosts");
    }
  } catch (error) {
    alert("Backend server is not running or MongoDB is not connected.");
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
    setTimeout(() => location.href = "login.html", 800);
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

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    message.textContent = "Login successful!";

    setTimeout(() => location.href = "dashboard.html", 700);
  } catch (error) {
    message.textContent = "Backend server is not running or MongoDB is not connected.";
  }
});

document.getElementById("blogForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = document.getElementById("blogMessage");
  message.textContent = "Publishing blog...";

  const payload = {
    title: document.getElementById("blogTitle").value.trim(),
    category: document.getElementById("blogCategory").value,
    content: document.getElementById("blogContent").value.trim()
  };

  try {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok) {
      message.textContent = data.message || "Could not publish blog.";
      return;
    }

    message.textContent = "Blog created successfully!";
    event.target.reset();

    setTimeout(() => {
      location.href = `blog-detail.html?id=${encodeURIComponent(data.blog._id)}`;
    }, 700);
  } catch (error) {
    message.textContent = "Backend server is not running or MongoDB is not connected.";
  }
});

async function loadProfile() {
  const target = document.getElementById("profileCard");
  if (!target) return;

  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: authHeaders()
    });

    const data = await response.json();

    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok) throw new Error(data.message || "Unable to load profile.");

    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    target.innerHTML = `
      <div class="profile-avatar">${safe(data.user.name).charAt(0).toUpperCase()}</div>
      <h2>${safe(data.user.name)}</h2>
      <p>${safe(data.user.email)}</p>
      <div class="profile-actions">
        <a class="btn" href="dashboard.html">My Dashboard</a>
        <button class="btn danger" id="profileLogout" type="button">Logout</button>
      </div>
    `;

    document.getElementById("profileLogout")?.addEventListener("click", logout);
  } catch (error) {
    target.innerHTML = `<p>${safe(error.message)}</p>`;
  }
}

function attachFilters() {
  const search = document.getElementById("searchBlogs");
  const category = document.getElementById("categoryFilter");
  const targetId = document.getElementById("dashboardPosts") ? "dashboardPosts" : "blogGrid";

  search?.addEventListener("input", () => renderPosts(targetId));
  category?.addEventListener("change", () => renderPosts(targetId));
}

function setupAuthUi() {
  const logoutButton = document.getElementById("logoutButton");
  logoutButton?.addEventListener("click", logout);

  const currentUser = getCurrentUser();
  const welcome = document.getElementById("welcomeText");

  if (welcome && currentUser) {
    welcome.textContent = `Welcome, ${currentUser.name}. Only your blogs are shown below.`;
  }
}

async function initializeApp() {
  const allowed = await verifyAuthentication();
  if (!allowed) return;

  setupAuthUi();
  attachFilters();
  renderPosts("blogGrid");
  renderPosts("dashboardPosts");
  loadBlogDetail();
  loadEditBlog();
  loadProfile();
}

initializeApp();
