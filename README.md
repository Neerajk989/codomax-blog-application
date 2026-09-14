# Codomax Blog Application

A production-ready **Full Stack Blog Application** created for the Codomax Digital Solutions Full Stack Web Development Internship.

The project includes a responsive frontend, REST API backend, MongoDB database integration, secure JWT authentication, user-specific dashboards, full CRUD operations, search/filter features, individual blog pages, profile management, logout, and Vercel deployment support.

## Live Demo

After deployment, add your live website URL here.

## GitHub Repository

https://github.com/Neerajk989/codomax-blog-application

## Features

- Responsive modern UI for desktop, tablet and mobile
- User Registration and Login
- Password hashing with bcrypt
- JWT-based authentication
- Private Dashboard
- User Profile and Logout
- Create, Read, Update and Delete blog posts
- Only the blog owner can edit or delete their posts
- Logged-in dashboard shows only the current user's blogs
- Public blog listing
- Individual blog detail pages
- Blog search by title, content or author
- Category filtering
- MongoDB database integration
- Production-ready Vercel serverless API

## Technology Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript

### Backend
- Node.js
- Express.js
- JSON Web Token
- bcryptjs

### Database
- MongoDB
- Mongoose

### Deployment
- Vercel

## Project Structure

```text
codomax-blog-application/
├── api/
│   └── index.js
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── edit-blog.html
├── blog-detail.html
├── profile.html
├── styles.css
├── script.js
├── package.json
├── vercel.json
└── README.md
```

## REST API

### Authentication
- `POST /api/register`
- `POST /api/login`
- `GET /api/profile`

### Blogs
- `GET /api/blogs`
- `GET /api/blogs/:id`
- `GET /api/my-blogs`
- `POST /api/blogs`
- `PUT /api/blogs/:id`
- `DELETE /api/blogs/:id`

### Health Check
- `GET /api/health`

## Authentication

Protected requests send the JWT in the HTTP Authorization header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

JWT tokens expire after 2 hours.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Neerajk989/codomax-blog-application.git
cd codomax-blog-application
```

### 2. Configure the backend

Create `backend/.env` using `backend/.env.example`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=use_a_long_random_secret
PORT=5000
```

Never commit your real `.env` file.

### 3. Install and run the local backend

```bash
cd backend
npm install
npm start
```

### 4. Run the frontend

Open the project root in VS Code and launch `index.html` with Live Server.

When running locally, the frontend automatically uses:

```text
http://localhost:5000/api
```

When deployed, it automatically uses:

```text
/api
```

## Vercel Deployment

This repository contains:

- `api/index.js` — Vercel serverless Express API
- root `package.json` — production dependencies
- `vercel.json` — API rewrite configuration

In Vercel, configure these Environment Variables:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
```

Then deploy the repository. Static HTML/CSS/JavaScript pages and the serverless API will run from the same Vercel project.

## Internship Modules Completed

### Module 1 — Frontend Development
Responsive Blog UI with Home, Login, Register, Dashboard and Create Blog pages.

### Module 2 — Backend Development
Node.js, Express.js and REST API integration.

### Module 3 — Database Integration
MongoDB and Mongoose for users and blog posts.

### Module 4 — CRUD Operations
Create, Read, Update and Delete with search and category filters.

### Module 5 — Authentication & Dashboard
JWT authentication, protected private pages, user-specific blogs, profile and logout.

### Module 6 — Final Project & Deployment
UI polish, bug fixes, mobile responsiveness, professional documentation and production deployment configuration.

## Security Notes

- Passwords are stored only as bcrypt hashes.
- Database credentials and JWT secrets are loaded from environment variables.
- `.env` is excluded from Git.
- Update and delete APIs enforce blog ownership.
- Private frontend pages verify the logged-in session with the backend.

## Author

**Neeraj Khapre**

Full Stack Web Development Internship Project  
Codomax Digital Solutions
