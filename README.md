# MERN Task Manager

A collaborative task management app with JWT authentication, CRUD operations, pagination, and real-time updates via Socket.io.

## Tech Stack

- **Frontend:** React, React Router, Context API, Axios, Socket.io-client
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Socket.io
- **Security:** bcrypt password hashing, express-mongo-sanitize (NoSQL injection protection)


# Setup & Run

### 1. Backend

cd backend
npm install

cp .env 
# Edit .env and set your MONGO_URI and JWT_SECRET

npm run dev
```

Backend runs on: http://localhost:5000

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000

## API Endpoints

| Method | Endpoint          | Description         | Auth Required |
|--------|-------------------|---------------------|---------------|
| POST   | /api/auth/signup  | Register new user   | No            |
| POST   | /api/auth/login   | Login user          | No            |
| GET    | /api/tasks        | Get tasks (paginated) | Yes         |
| POST   | /api/tasks        | Create a task       | Yes           |
| PUT    | /api/tasks/:id    | Update a task       | Yes           |
| DELETE | /api/tasks/:id    | Delete a task       | Yes           |

Pagination query params: `?page=1&limit=5`

## Features

- User signup and login with JWT
- Create, read, update, delete tasks
- Mark tasks as completed
- Pagination (5 tasks per page)
- Real-time notifications via Socket.io when tasks are created/updated/deleted
- Passwords hashed with bcrypt
- API protected against NoSQL injection using express-mongo-sanitize
- Protected routes on frontend (redirect to login if not authenticated)
