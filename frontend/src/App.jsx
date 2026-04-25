import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Loader from './components/Loader';
import ProtectedRoute from './routes/ProtectedRoute';

// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import DashboardLayout from './components/DashboardLayout';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import Register from './pages/Register';

// Student pages
import MyCourses from './pages/student/MyCourses';
import Profile from './pages/student/Profile';

// Shared pages
import PendingApprovals from './pages/shared/PendingApprovals';

// Instructor pages
import CreateCourse from './pages/instructor/CreateCourse';
import ManageCourses from './pages/instructor/ManageCourses';
import EditCourse from './pages/instructor/EditCourse';

// Admin pages
import ManageUsers from './pages/admin/ManageUsers';
import AdminManageCourses from './pages/admin/ManageCourses';
import Analytics from './pages/admin/Analytics';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Loader text="Loading AliStack EduVerse..." />;
  }

  return (
    <div className="app">
      <Routes>
        {/* Public Routes with Public Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Dashboard Routes with Dashboard Layout */}
        <Route element={<DashboardLayout />}>
          {/* Student Routes */}
          <Route path="/student/my-courses" element={
            <ProtectedRoute roles={['student']}>
              <MyCourses />
            </ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute roles={['student', 'instructor', 'admin']}>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Instructor Routes */}
          <Route path="/instructor/courses" element={
            <ProtectedRoute roles={['instructor']}>
              <ManageCourses />
            </ProtectedRoute>
          } />
          <Route path="/instructor/approvals" element={
            <ProtectedRoute roles={['instructor']}>
              <PendingApprovals />
            </ProtectedRoute>
          } />
          <Route path="/instructor/create-course" element={
            <ProtectedRoute roles={['instructor']}>
              <CreateCourse />
            </ProtectedRoute>
          } />
          <Route path="/instructor/edit-course/:id" element={
            <ProtectedRoute roles={['instructor']}>
              <EditCourse />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/analytics" element={
            <ProtectedRoute roles={['admin']}>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/admin/approvals" element={
            <ProtectedRoute roles={['admin']}>
              <PendingApprovals />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['admin']}>
              <ManageUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute roles={['admin']}>
              <AdminManageCourses />
            </ProtectedRoute>
          } />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div className="empty-state" style={{ paddingTop: '10vh' }}>
            <div className="empty-state-icon">🔍</div>
            <h3>Page Not Found</h3>
            <p>The page you're looking for doesn't exist.</p>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;
