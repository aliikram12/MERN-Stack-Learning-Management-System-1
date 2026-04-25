import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiArrowRight, FiBookOpen, FiUsers, FiAward, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
// Ensure CountUp is a valid component (handles different build targets)
const CountUpComponent = typeof CountUp === 'function' ? CountUp : (CountUp.CountUp || CountUp.default || CountUp);
import courseService from '../services/courseService';
import CourseCard from '../components/CourseCard';
import './Home.css';
import heroBg from '../assets/hero-bg.png';

const features = [
  { Icon: FiBookOpen, title: 'Expert-Led Courses', desc: 'Learn from industry professionals with real-world experience and proven track records.' },
  { Icon: FiUsers, title: 'Community Learning', desc: 'Join a vibrant community of learners. Collaborate, discuss, and grow together.' },
  { Icon: FiAward, title: 'Certifications', desc: 'Earn certificates upon completion to showcase your expertise and boost your career.' },
  { Icon: FiTrendingUp, title: 'Track Progress', desc: 'Monitor your learning journey with detailed progress tracking and analytics.' },
];

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getCourses({ limit: 6, sort: 'popular' });
        // Handle both { data: [...] } and directly [...]
        const courses = Array.isArray(res) ? res : (res?.data || []);
        setFeaturedCourses(Array.isArray(courses) ? courses : []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setFeaturedCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="hero-badge">🚀 #1 Learning Platform</span>
            <h1 className="hero-title">
              Master Your Future with <span className="gradient-text">AliStack EduVerse</span>
            </h1>
            <p className="hero-subtitle">
              Unlock your potential with world-class courses from industry experts.
              Join 10,000+ learners advancing their careers with our premium SaaS platform.
            </p>
            <div className="hero-cta">
              <Link to="/courses" className="btn btn-primary btn-lg" id="hero-browse-btn">
                Browse Courses <FiArrowRight />
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg" id="hero-register-btn">
                Get Started Free
              </Link>
            </div>
          </motion.div>

          <div className="hero-visual">
            <div className="floating-cards-container">
              {[
                { title: 'Fullstack Web Dev', color: '#3b82f6', top: '5%', left: '10%', delay: 0 },
                { title: 'UI/UX Design Masterclass', color: '#10b981', top: '40%', left: '55%', delay: 1 },
                { title: 'Python for Data Science', color: '#f59e0b', top: '20%', left: '50%', delay: 0.5 },
                { title: 'Advanced React Patterns', color: '#dc2626', top: '70%', left: '45%', delay: 1.5 },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  className={`floating-mini-card card-${i + 1}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: [0, -15, 0],
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: card.delay
                  }}
                  style={{
                    position: 'absolute',
                    top: card.top,
                    left: card.left,
                    background: 'white',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderLeft: `4px solid ${card.color}`,
                    zIndex: 2,
                    minWidth: '200px'
                  }}
                >
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: `${card.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                  }}>
                    📚
                  </div>
                  <span style={{ fontWeight: '600', fontSize: '14px', color: '#1f2937' }}>{card.title}</span>
                </motion.div>
              ))}
              <div className="hero-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features section" id="features-section">
        <div className="container">
          <div className="section-header">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Why Choose <span className="gradient-text">AliStack EduVerse</span>?
            </motion.h2>
            <p>Everything you need to succeed in your learning journey</p>
          </div>
          <div className="features-grid">
            {features.map((feature, i) => {
              const Icon = feature.Icon;
              return (
                <motion.div 
                  key={i} 
                  className="feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, boxShadow: 'var(--shadow-xl)' }}
                >
                  <div className="feature-icon">
                    {Icon ? <Icon /> : <FiBookOpen />}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="featured-courses section" id="featured-courses">
        <div className="container">
          <div className="section-header">
            <h2>Featured <span className="gradient-text">Courses</span></h2>
            <p>Start learning from our most popular courses</p>
          </div>
          {loading ? (
            <div className="courses-loading">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton skeleton-img"></div>
                  <div className="skeleton-body">
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text short"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="courses-grid">
              {(featuredCourses || []).map((course, index) => (
                <CourseCard key={course?._id || index} course={course} index={index} />
              ))}
            </div>
          )}
          <div className="section-cta">
            <Link to="/courses" className="btn btn-primary btn-lg">
              View All Courses <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section" id="cta-section">
        <div className="container">
          <motion.div 
            className="cta-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Start <span className="gradient-text">Learning</span>?</h2>
            <p>Join AliStack EduVerse today and master the skills that matter most in the modern industry.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Free Account <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
