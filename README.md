# 🎓 EduVerse — MERN Stack Learning Management System

A full-featured, production-ready Learning Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)
![License](https://img.shields.io/badge/License-ISC-green)

---

## ✨ Features

### Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt (12 salt rounds)
- Role-based access control (Admin, Instructor, Student)
- Protected API routes with middleware

### Student Features
- Browse and search courses with filters
- Enroll in courses
- Track learning progress
- Manage profile

### Instructor Features
- Create and manage courses
- Add/edit/delete lessons
- View enrollment statistics

### Admin Features
- Analytics dashboard with platform stats
- Manage all users (view, search, delete)
- Manage all courses
- Category distribution charts

### UI/UX
- Modern dark theme with glassmorphism
- Responsive design (mobile-first)
- Smooth animations and transitions
- Toast notifications
- Loading skeletons
- Search, filter, sort, pagination

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router, Axios, React Icons, React Hot Toast |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, Bcrypt.js |
| Build Tool | Vite |
| Styling | Vanilla CSS (Custom Design System) |

---

## 📂 Project Structure

```
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route handlers (auth, user, course, enrollment)
│   ├── middleware/      # Auth & error handling middleware
│   ├── models/         # Mongoose schemas (User, Course, Enrollment)
│   ├── routes/         # Express route definitions
│   ├── utils/          # Helpers (JWT, ErrorResponse, seeder)
│   ├── server.js       # Express app entry point
│   └── .env            # Environment variables
│
├── frontend/
│   └── src/
│       ├── components/ # Reusable UI components
│       ├── context/    # React Context (Auth)
│       ├── pages/      # All page components
│       │   ├── student/
│       │   ├── instructor/
│       │   └── admin/
│       ├── routes/     # Protected Route component
│       ├── services/   # Axios API service modules
│       ├── App.jsx     # Main app with routing
│       ├── main.jsx    # Entry point
│       └── index.css   # Design system & global styles
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm

### 1. Clone the repository
```bash
git clone <repo-url>
cd "MERN Stack Learning Management System"
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file (or use the existing one):
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/lms_db
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d
```

Seed the database with sample data:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` with API proxy to `http://localhost:5000`.

---

## 👤 Demo Accounts

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lms.com | admin123 |
| Instructor | sarah@lms.com | instructor123 |
| Instructor | michael@lms.com | instructor123 |
| Student | john@lms.com | student123 |
| Student | jane@lms.com | student123 |

---

## 🔌 API Endpoints

### Auth
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |

### Users
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/users` | Admin |
| DELETE | `/api/users/:id` | Admin |
| PUT | `/api/users/profile` | Private |

### Courses
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/courses` | Public |
| GET | `/api/courses/:id` | Public |
| POST | `/api/courses` | Instructor |
| PUT | `/api/courses/:id` | Instructor/Admin |
| DELETE | `/api/courses/:id` | Instructor/Admin |
| GET | `/api/courses/instructor/me` | Instructor |
| GET | `/api/courses/admin/all` | Admin |
| POST | `/api/courses/:id/lessons` | Instructor |
| DELETE | `/api/courses/:id/lessons/:lessonId` | Instructor |

### Enrollment
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/enroll` | Student |
| GET | `/api/enroll/my-courses` | Student |
| PUT | `/api/enroll/:id/progress` | Student |
| GET | `/api/enroll/check/:courseId` | Private |
| GET | `/api/enroll/analytics` | Admin |

---

## 🧪 Testing with Postman

1. **Register**: POST `http://localhost:5000/api/auth/register`
   ```json
   { "name": "Test User", "email": "test@test.com", "password": "test123", "role": "student" }
   ```

2. **Login**: POST `http://localhost:5000/api/auth/login`
   ```json
   { "email": "test@test.com", "password": "test123" }
   ```

3. Use the returned `token` in Authorization header:
   ```
   Authorization: Bearer <your_token>
   ```

---

## 🚢 Deployment

### Backend (Render / Railway)
1. Push code to GitHub
2. Connect repo to Render/Railway
3. Set environment variables
4. Deploy with `npm start`

### Frontend (Vercel / Netlify)
1. Set build command: `npm run build`
2. Set output directory: `dist`
3. Add environment variable for API URL

### Database
- Use MongoDB Atlas for production database
- Update `MONGO_URI` in production environment

---

## 📝 License

ISC License

---

Built with ❤️ using the MERN Stack
