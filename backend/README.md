# Codomax Blog Backend

Backend for the Codomax Full Stack Web Development Internship project.

## Module 5 Authentication

This backend uses **JWT authentication** with MongoDB.

### Security Features

- Passwords are hashed with bcrypt.
- Login returns a signed JWT.
- JWT expires after 2 hours.
- Protected routes require `Authorization: Bearer <token>`.
- Blog documents store an `owner` user ID.
- Update and delete operations are limited to the blog owner.
- MongoDB URI and JWT secret are stored in environment variables.

## Environment Variables

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=use_a_long_random_secret
PORT=5000
```

Do not commit your real `.env` file.

## Setup

```bash
cd backend
npm install
npm start
```

## Authentication APIs

### Register
`POST /api/register`

### Login
`POST /api/login`

The login response contains:

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

### Profile
`GET /api/profile`

Protected with a Bearer token.

### My Blogs
`GET /api/my-blogs`

Returns only blogs owned by the authenticated user.

## Blog APIs

- `POST /api/blogs` — protected
- `GET /api/blogs` — public
- `GET /api/blogs/:id` — public
- `PUT /api/blogs/:id` — protected + owner-only
- `DELETE /api/blogs/:id` — protected + owner-only
