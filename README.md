# Codomax Blog Application

Full Stack Web Development internship project for **Codomax Digital Solutions**.

## Module 1 — Frontend Development
Completed:
- Responsive Blog Application
- Home page
- Login page
- Register page
- Dashboard
- Create Blog page

## Module 2 — Backend Development
Completed:
- Node.js and Express.js backend
- REST APIs
- User Registration
- User Login
- Create Blog
- Frontend and backend integration

## Module 3 — Database Integration
Completed:
- MongoDB + Mongoose
- User credentials stored in MongoDB
- Passwords hashed with bcrypt
- Blog posts stored in MongoDB
- Retrieve all blogs
- Individual blog details page

## Module 4 — CRUD Operations
Completed:
- **Create** blog posts
- **Read** all blogs and individual blog details
- **Update** existing blogs
- **Delete** blogs
- Search blogs by title, content or author
- Filter blogs by category
- Edit Blog page
- Delete controls from dashboard and blog details
- MongoDB-backed CRUD REST APIs

## Technologies

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- bcryptjs
- CORS
- dotenv

### Database
- MongoDB
- Mongoose

## CRUD REST API Endpoints

- `POST /api/blogs` — Create blog
- `GET /api/blogs` — Read all blogs
- `GET /api/blogs/:id` — Read one blog
- `PUT /api/blogs/:id` — Update blog
- `DELETE /api/blogs/:id` — Delete blog
- `GET /api/blogs?search=term&category=Technology` — Search/filter blogs

Authentication:
- `POST /api/register`
- `POST /api/login`

## Project Pages
- `index.html` — Home, search, category filter
- `login.html` — Login
- `register.html` — Register
- `dashboard.html` — Manage blogs with Edit/Delete
- `create-blog.html` — Create Blog
- `edit-blog.html` — Update Blog
- `blog-detail.html` — Individual Blog Details

## Run the Project

### 1. Configure MongoDB

Create `backend/.env` using `backend/.env.example`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### 2. Start backend

```bash
cd backend
npm install
npm start
```

### 3. Start frontend

Open the root folder with VS Code and launch `index.html` using Live Server.

## Internship Submission

**GitHub Repository:** https://github.com/Neerajk989/codomax-blog-application

Created by **Neeraj Khapre** as part of the Codomax Full Stack Web Development Internship.
