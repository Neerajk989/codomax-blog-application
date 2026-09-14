# Codomax Blog Application

Full Stack Web Development internship project for **Codomax Digital Solutions**.

## Module 1 — Day 1 to Day 4

Frontend Development | Beginner | High Priority

### Completed

- Set up the frontend project
- Built the application using HTML, CSS and JavaScript
- Created a responsive Blog Application interface
- Home page
- Login page
- Register page
- Dashboard
- Create Blog page

## Module 2 — Day 5 to Day 8

Backend Development | Intermediate | High Priority

### Completed

- Set up a backend server using Node.js and Express.js
- Created REST APIs
- User Registration API
- User Login API
- Create Blog API
- Get Blogs API
- Connected the frontend forms and blog pages to backend APIs
- Added bcrypt password hashing
- Added simple JSON file persistence for users and blogs

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
- JSON file storage

## REST API Endpoints

- `POST /api/register`
- `POST /api/login`
- `POST /api/blogs`
- `GET /api/blogs`

## Run the Project

### 1. Start the backend

```bash
cd backend
npm install
npm start
```

Backend runs at:

```
http://localhost:5000
```

### 2. Start the frontend

Open the project root using VS Code and launch `index.html` with Live Server.

The frontend uses:

```
http://localhost:5000/api
```

as its API base URL.

## Project Pages

- `index.html` — Home
- `login.html` — Login
- `register.html` — Register
- `dashboard.html` — Dashboard
- `create-blog.html` — Create Blog

## Backend Files

- `backend/server.js` — Express server and REST APIs
- `backend/package.json` — Backend dependencies and scripts
- `backend/data.json` — Simple development data storage
- `backend/README.md` — API usage instructions

## Internship Submission

**GitHub Repository:** https://github.com/Neerajk989/codomax-blog-application

Created by **Neeraj Khapre** as part of the Codomax Full Stack Web Development Internship.
