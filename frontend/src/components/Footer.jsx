import { Link } from 'react-router-dom';
import { FiGithub, FiMail, FiLinkedin, FiHeart } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container container">
        <div className="footer-grid">
          {/* Column 1: Brand & About */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">🎓</span>
              <span className="logo-text">AliStack <span className="logo-accent">EduVerse</span></span>
            </Link>
            <p className="footer-desc">
              Empowering learners worldwide with quality education. 
              Learn at your own pace from industry experts with our professional SaaS learning management system.
            </p>
            <div className="social-icons">
              <a href="https://x.com/info_ikram57" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"><FaXTwitter /></a>
              <a href="https://www.linkedin.com/in/aliikram57/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href="https://github.com/aliikram12" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FiGithub /></a>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="footer-links-group">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/courses">Browse Courses</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/login">Sign In</Link></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="footer-links-group">
            <h4>Top Categories</h4>
            <ul>
              <li><Link to="/courses?category=Web">Web Development</Link></li>
              <li><Link to="/courses?category=Data">Data Science</Link></li>
              <li><Link to="/courses?category=Design">UI/UX Design</Link></li>
              <li><Link to="/courses?category=Marketing">Digital Marketing</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="footer-links-group">
            <h4>Contact Us</h4>
            <ul>
              <li>
                <a href="mailto:support@eduverse.com" className="contact-link">
                  <FiMail /> support@eduverse.com
                </a>
              </li>
              <li className="contact-address">
                123 Innovation Drive<br/>Tech City, CA 94043
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AliStack EduVerse. Made with <FiHeart className="heart-icon" /> for education.</p>
          <div className="footer-legal">
            <Link to="/terms">Terms of Service</Link>
            <span className="separator">·</span>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
