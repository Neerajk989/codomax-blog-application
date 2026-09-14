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
- MongoDB database integration with Mongoose
- User credentials stored in MongoDB
- Passwords hashed with bcrypt
- Blog posts stored in MongoDB
- Retrieve and display all blogs from the database
- Individual blog details page
- `GET /api/blogs/:id` API
- Secure database connection through `MONGODB_URI` environment variable

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

## REST API Endpoints

- `POST /api/register`
- `POST /api/login`
- `POST /api/blogs`
- `GET /api/blogs`
- `GET /api/blogs/:id`

## Project Pages

- `index.html` — Home and all database blogs
- `login.html` — Login
- `register.html` — Register
- `dashboard.html` — Dashboard
- `create-blog.html` — Create Blog
- `blog-detail.html` — Individual Blog Details

## Run the Project

### 1. Configure MongoDB

Inside the `backend` folder, copy `.env.example` to `.env` and replace the example value with your MongoDB Atlas connection string.

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### 2. Start the backend

```bash
cd backend
npm install
npm start
```

### 3. Start the frontend

Open the project root with VS Code and run `index.html` using Live Server.

## Internship Submission

**GitHub Repository:** https://github.com/Neerajk989/codomax-blog-application

Created by **Neeraj Khapre** as part of the Codomax Full Stack Web Development Internship.
