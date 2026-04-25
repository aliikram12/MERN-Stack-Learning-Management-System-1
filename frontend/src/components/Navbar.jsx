import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiBookOpen } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  // Close dropdown and menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('.mobile-toggle')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin': return '/admin/analytics';
      case 'instructor': return '/instructor/courses';
      case 'student': return '/student/my-courses';
      default: return '/';
    }
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo" id="navbar-logo" onClick={() => setMenuOpen(false)}>
            <span className="logo-icon">🎓</span>
            <span className="logo-text">AliStack <span className="logo-accent">EduVerse</span></span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="navbar-links">
          <Link to="/" className="nav-link" id="nav-home">Home</Link>
          <Link to="/courses" className="nav-link" id="nav-courses">Courses</Link>
          <Link to="/about" className="nav-link" id="nav-about">About</Link>
        </div>

        <div className="navbar-right">
          {user ? (
            <div className="user-menu" ref={dropdownRef}>
              <button
                className="user-menu-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                id="user-menu-btn"
              >
                <div className="user-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user.name}</span>
                <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>▾</span>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu animate-fadeIn" id="user-dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-email">{user.email}</span>
                    <span className="badge badge-primary">{user.role}</span>
                  </div>
                  <div className="dropdown-divider" />
                  <Link
                    to={getDashboardLink()}
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                    id="dropdown-dashboard"
                  >
                    <FiBookOpen /> Dashboard
                  </Link>
                  <Link
                    to="/student/profile"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                    id="dropdown-profile"
                  >
                    <FiUser /> Profile
                  </Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout" onClick={handleLogout} id="dropdown-logout">
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons desktop-only">
              <Link to="/login" className="btn btn-secondary btn-sm" id="nav-login">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register">Register</Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button 
            className={`mobile-toggle ${menuOpen ? 'open' : ''}`} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} ref={menuRef}>
          <div className="mobile-menu-links">
            <Link to="/" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/courses" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Courses</Link>
            <Link to="/about" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>About</Link>
            
            {!user && (
              <div className="mobile-auth-buttons">
                <Link to="/login" className="btn btn-secondary btn-block" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary btn-block" onClick={() => setMenuOpen(false)}>Register</Link>
              </div>
            )}
            
            {user && (
              <div className="mobile-user-actions">
                <Link to={getDashboardLink()} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                  <FiBookOpen /> Dashboard
                </Link>
                <button className="mobile-nav-link logout" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
