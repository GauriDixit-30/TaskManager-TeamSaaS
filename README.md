# TaskManager SaaS

A clean, fast, SaaS-style team task manager built with React, Vite, Node.js, Express, and MongoDB.

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS, React Router
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Auth

## Project Structure
The project is split into two main directories:
- `/frontend`: The Vite React application.
- `/backend`: The Express Node.js API server.

## Local Setup

### Prerequisites
- Node.js installed
- MongoDB installed locally OR a MongoDB Atlas URI

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend directory (already created for you with default values):
   ```env
   PORT=5000
   DB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=supersecretjwtkey123!
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a second terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the provided localhost link in your browser.

## API Documentation

### Auth
- `POST /api/auth/signup` - Register a new user (admin or member)
- `POST /api/auth/login` - Authenticate a user and receive JWT

### Projects (Requires Auth)
- `GET /api/projects` - Get all projects for the logged-in user
- `POST /api/projects` - Create a new project (Admin only)
- `GET /api/projects/:id` - Get details of a specific project
- `POST /api/projects/:id/add-member` - Add a user to a project (Admin only)

### Tasks (Requires Auth)
- `GET /api/tasks?projectId=ID` - Get all tasks for a specific project
- `POST /api/tasks` - Create a new task (Admins can assign to anyone, Members only to themselves)
- `PUT /api/tasks/:id` - Update a task (status, description, assignment)
- `DELETE /api/tasks/:id` - Delete a task (Admin only)

### Dashboard (Requires Auth)
- `GET /api/dashboard` - Get task overview metrics for the current user

## Deployment to Railway

1. Push this repository to GitHub.
2. Go to [Railway](https://railway.app/).
3. Create a new Project from your GitHub Repo.
4. **Important**: Since this is a monorepo, you must configure two services in Railway (one for backend, one for frontend).
   - **Backend Service:**
     - Root Directory: `/backend`
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Add Variables: `DB_URI` (from MongoDB Atlas) and `JWT_SECRET`.
   - **Frontend Service:**
     - Root Directory: `/frontend`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm run preview -- --port $PORT --host 0.0.0.0`
     - Add Variables: `VITE_API_URL` pointing to the Railway backend public URL.