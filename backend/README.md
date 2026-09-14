# Codomax Blog Backend

Backend module for the Codomax Full Stack Web Development Internship.

## Setup

```bash
cd backend
npm install
npm start
```

The server runs at:

`http://localhost:5000`

## REST APIs

### Register User
`POST /api/register`

Example body:

```json
{
  "name": "Neeraj Khapre",
  "email": "neeraj@example.com",
  "password": "123456"
}
```

### Login User
`POST /api/login`

Example body:

```json
{
  "email": "neeraj@example.com",
  "password": "123456"
}
```

### Create Blog
`POST /api/blogs`

Example body:

```json
{
  "title": "My Blog",
  "category": "Technology",
  "content": "My first backend-powered blog post.",
  "author": "Neeraj Khapre"
}
```

### Get Blogs
`GET /api/blogs`

Passwords are stored as bcrypt hashes in `data.json`.