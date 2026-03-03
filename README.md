# InterviewHub – Full-Stack Interview Question Sharing Platform

A complete full-stack platform for sharing and discovering real technical interview questions.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v4 |
| Routing | React Router v7 |
| Forms | React Hook Form |
| Charts | Recharts |
| Backend | Node.js + Express |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT |

## Project Structure

```
crimson-aldrin/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/   # Navbar, Footer, QuestionCard, Badge, FilterPanel, etc.
│       ├── pages/        # Home, Browse, SubmitQuestion, AdminLogin, AdminDashboard
│       ├── layouts/      # MainLayout
│       ├── services/     # api.js (Axios)
│       └── context/      # AuthContext (JWT)
└── server/          # Express backend
    └── src/
        ├── config/       # MongoDB connection
        ├── models/       # Question schema
        ├── routes/       # /api/questions, /api/admin
        ├── controllers/  # questionController, adminController
        └── middleware/   # JWT auth
```

## Quick Start

### 1. Configure Database

Edit `server/.env` and replace `MONGODB_URI` with your MongoDB Atlas connection string:
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/interview-platform
```

### 2. Start the Backend
```bash
cd server
npm run dev
```
Backend runs on **http://localhost:5000**

### 3. Start the Frontend
```bash
cd client
npm run dev
```
Frontend runs on **http://localhost:5173**

## Default Admin Credentials

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

> ⚠️ Change these in `server/.env` before deploying to production!

## API Endpoints

```
POST   /api/questions              Submit a question (status = pending)
GET    /api/questions?filters...   Browse approved questions
GET    /api/questions/stats        Platform statistics

POST   /api/admin/login            Get JWT token
GET    /api/admin/pending          All pending questions  [Protected]
PUT    /api/admin/approve/:id      Approve a question     [Protected]
PUT    /api/admin/reject/:id       Reject a question      [Protected]
PUT    /api/admin/edit/:id         Edit a question        [Protected]
DELETE /api/admin/delete/:id       Delete a question      [Protected]
GET    /api/admin/analytics        Analytics data         [Protected]
```

## Deployment

### Frontend (Vercel / Netlify)
Set environment variable:
```
VITE_API_URL=https://your-backend-url.com
```
Update `client/vite.config.js` proxy or use the env var directly in `src/services/api.js`.

### Backend (Render / Railway)
Set environment variables:
```
PORT=5000
MONGODB_URI=<your atlas URI>
JWT_SECRET=<strong random secret>
ADMIN_USERNAME=<your admin username>
ADMIN_PASSWORD=<your strong password>
```
