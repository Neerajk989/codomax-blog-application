# Codomax Blog Application

Full Stack Web Development internship project for **Codomax Digital Solutions**.

## Module 1 — Frontend Development
Completed:
- Responsive Blog Application
- Home, Login, Register, Dashboard and Create Blog pages

## Module 2 — Backend Development
Completed:
- Node.js and Express.js backend
- REST APIs
- User Registration and Login
- Frontend/backend integration

## Module 3 — Database Integration
Completed:
- MongoDB + Mongoose
- User credentials and blogs stored in MongoDB
- bcrypt password hashing
- Individual blog details page

## Module 4 — CRUD Operations
Completed:
- Create, Read, Update and Delete blogs
- Search blogs
- Category filters
- Edit Blog page

## Module 5 — Authentication & Dashboard
Completed:
- JWT-based user authentication
- JWT token returned after successful login
- Protected backend routes using Bearer tokens
- Protected Dashboard, Create Blog, Edit Blog and Profile pages
- Dashboard shows only the logged-in user's blogs
- Blog ownership stored with each MongoDB blog document
- Users can edit/delete only their own blogs
- User Profile page
- Logout functionality
- JWT expiry set to 2 hours
- Profile API: `GET /api/profile`
- User-specific blogs API: `GET /api/my-blogs`

## Technologies

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- JSON Web Token (JWT)
- bcryptjs
- CORS
- dotenv

### Database
- MongoDB
- Mongoose

## Authentication API

- `POST /api/register` — Register user
- `POST /api/login` — Login and receive JWT
- `GET /api/profile` — Protected profile
- `GET /api/my-blogs` — Protected logged-in user's blogs

Protected requests use:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Blog API

- `POST /api/blogs` — Create blog (protected)
- `GET /api/blogs` — Public list of blogs
- `GET /api/blogs/:id` — Public individual blog
- `PUT /api/blogs/:id` — Update own blog (protected)
- `DELETE /api/blogs/:id` — Delete own blog (protected)

## Project Pages

- `index.html` — Public blog listing
- `login.html` — Login
- `register.html` — Register
- `dashboard.html` — Private user dashboard
- `create-blog.html` — Protected create page
- `edit-blog.html` — Protected edit page
- `blog-detail.html` — Blog details
- `profile.html` — Private user profile

## Environment Setup

Create `backend/.env` from `backend/.env.example`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=use_a_long_random_secret
PORT=5000
```

Never commit your real `.env` file.

## Run

```bash
cd backend
npm install
npm start
```

Then open the frontend using VS Code Live Server.

## Internship Submission

**GitHub Repository:** https://github.com/Neerajk989/codomax-blog-application

Created by **Neeraj Khapre** as part of the Codomax Full Stack Web Development Internship.
