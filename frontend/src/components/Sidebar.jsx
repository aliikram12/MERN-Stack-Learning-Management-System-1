import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiBookOpen, FiPlusCircle, FiSettings,
  FiUsers, FiBarChart2, FiBook, FiUser, FiX, FiCheckCircle
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const studentLinks = [
    { to: '/student/my-courses', Icon: FiBookOpen, label: 'My Courses' },
    { to: '/student/profile', Icon: FiUser, label: 'Profile' },
  ];

  const instructorLinks = [
    { to: '/instructor/courses', Icon: FiBook, label: 'My Courses' },
    { to: '/instructor/approvals', Icon: FiCheckCircle, label: 'Pending Approvals' },
    { to: '/instructor/create-course', Icon: FiPlusCircle, label: 'Create Course' },
  ];

  const adminLinks = [
    { to: '/admin/analytics', Icon: FiBarChart2, label: 'Analytics' },
    { to: '/admin/approvals', Icon: FiCheckCircle, label: 'Pending Approvals' },
    { to: '/admin/users', Icon: FiUsers, label: 'Manage Users' },
    { to: '/admin/courses', Icon: FiBookOpen, label: 'Manage Courses' },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'student': return studentLinks;
      case 'instructor': return instructorLinks;
      case 'admin': return adminLinks;
      default: return [];
    }
  };

  const links = getLinks();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="dashboard-sidebar">
        <div className="sidebar-header">
          <h3 className="sidebar-title">
            {user?.role === 'admin' && '🛡️ Admin Panel'}
            {user?.role === 'instructor' && '📚 Instructor'}
            {user?.role === 'student' && '🎒 Student'}
          </h3>
          <button className="sidebar-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <span className="sidebar-section-label">Dashboard</span>
            {links.map((link) => {
              const Icon = link.Icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={onClose}
                >
                  <span className="sidebar-link-icon"><Icon /></span>
                  <span className="sidebar-link-label">{link.label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="sidebar-section">
            <span className="sidebar-section-label">General</span>
            <NavLink to="/" className="sidebar-link" onClick={onClose}>
              <span className="sidebar-link-icon"><FiHome /></span>
              <span className="sidebar-link-label">Home</span>
            </NavLink>
            <NavLink to="/courses" className="sidebar-link" onClick={onClose}>
              <span className="sidebar-link-icon"><FiBookOpen /></span>
              <span className="sidebar-link-label">Browse Courses</span>
            </NavLink>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="sidebar-user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name}</span>
              <span className="sidebar-user-role">{user?.role}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
