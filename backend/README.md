# Codomax Blog Backend

Backend for the Codomax Full Stack Web Development Internship project.

## Database Integration

This version uses **MongoDB with Mongoose**.

User credentials and blog posts are stored in MongoDB. Passwords are never stored as plain text; they are hashed with bcrypt.

## Setup

1. Create a MongoDB Atlas database.
2. Copy `.env.example` to `.env`.
3. Put your MongoDB connection string in `MONGODB_URI`.
4. Install dependencies and start the server.

```bash
cd backend
npm install
npm start
```

The backend runs at:

`http://localhost:5000`

## Environment Variables

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

Do not commit your real `.env` file.

## REST APIs

### Register User
`POST /api/register`

### Login User
`POST /api/login`

### Create Blog
`POST /api/blogs`

### Get All Blogs
`GET /api/blogs`

### Get Individual Blog
`GET /api/blogs/:id`

## Security

- Passwords are hashed using bcrypt.
- The MongoDB URI is stored in an environment variable.
- `.env` and `node_modules` are excluded by `.gitignore`.
