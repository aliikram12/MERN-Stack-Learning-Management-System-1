import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import NotificationMenu from './NotificationMenu';
import './DashboardLayout.css';

/**
 * DashboardLayout — wraps dashboard pages with sidebar + top header + outlet
 */
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="dashboard-main">
        {/* Dashboard Top Header */}
        <header className="dashboard-header">
          <div className="dashboard-header-left">
            <button 
              className="sidebar-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h2 className="dashboard-page-title">AliStack EduVerse Dashboard</h2>
          </div>
          
          <div className="dashboard-header-right">
            <div className="user-profile-menu">
              <NotificationMenu />
              <div className="user-info-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span className="user-name" style={{ marginLeft: 'var(--space-4)' }}>Hello, {user?.name}</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="dashboard-content">
          <div className="dashboard-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
