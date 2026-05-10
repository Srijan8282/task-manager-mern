# Task Manager

A collaborative task management application built with the MERN stack. Multiple users can sign up, log in, and manage tasks together. Any change made by one user — whether creating, updating, or deleting a task — is instantly visible to all other logged-in users without refreshing the page.

## Tech Stack

**Frontend:** React, React Router, Context API, Axios, Socket.io-client

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Socket.io

## Features

- User signup and login with JWT based authentication
- Create, edit, delete, and mark tasks as completed
- Real-time updates using Socket.io — all connected users see changes instantly
- Pagination — 5 tasks per page
- Passwords are hashed using bcrypt before storing in the database
- Protected API routes — only authenticated users can access tasks
- NoSQL injection protection using express-mongo-sanitize

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB running locally or a MongoDB Atlas connection string

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder with the following:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_secret_key_here
```

Start the backend server:

```bash
npm run dev
```

Server runs on http://localhost:5000

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Create a `.env` file in the frontend folder with the following:
```
REACT_APP_BACKEND_URL = 'http://localhost:5000'
```

App runs on http://localhost:3000

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/signup | Register a new user | No |
| POST | /api/auth/login | Login with email and password | No |
| GET | /api/tasks | Get all tasks (paginated) | Yes |
| POST | /api/tasks | Create a new task | Yes |
| PUT | /api/tasks/:id | Update a task | Yes |
| DELETE | /api/tasks/:id | Delete a task | Yes |


## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Port number for the backend server |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret key used to sign JWT tokens |

## Deployment

The frontend is deployed on Vercel and the backend is deployed on Render with MongoDB Compass as the database.