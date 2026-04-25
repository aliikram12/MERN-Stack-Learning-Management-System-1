import { FiTarget, FiHeart, FiGlobe, FiZap, FiPhoneCall } from 'react-icons/fi';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
// Robust CountUp handling
const CountUpComponent = typeof CountUp === 'function' ? CountUp : (CountUp.CountUp || CountUp.default || CountUp);
import './About.css';
import heroBg from '../assets/hero-bg.png';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="about-hero-overlay"></div>
        <div className="container">
          <motion.div 
            className="about-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>About <span className="gradient-text">AliStack EduVerse</span></h1>
            <p className="about-hero-subtitle">
              We're on a mission to democratize education and make world-class learning 
              accessible to everyone, everywhere.
            </p>
            <motion.a 
              href="tel:03361711707" 
              className="btn btn-primary btn-lg about-cta"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPhoneCall /> Contact With Us
            </motion.a>
          </motion.div>
        </div>
      </section>

      <section className="about-mission section">
        <div className="container">
          <div className="about-grid">
            {[
              { Icon: FiTarget, title: 'Our Mission', desc: 'To empower millions of learners worldwide by providing high-quality, affordable education that transforms careers and lives.' },
              { Icon: FiHeart, title: 'Our Values', desc: 'We believe in accessibility, excellence, and community. Every learner deserves the opportunity to grow, regardless of their background.' },
              { Icon: FiGlobe, title: 'Global Reach', desc: 'With students from over 100 countries, AliStack EduVerse connects learners with the best instructors across the globe.' },
              { Icon: FiZap, title: 'Innovation', desc: 'We leverage cutting-edge technology to create personalized learning experiences that adapt to each student\'s pace and style.' },
            ].map((item, i) => {
              const Icon = item.Icon;
              return (
                <motion.div 
                  key={i} 
                  className="about-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
                >
                  <div className="about-card-icon"><Icon /></div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="about-stats section">
        <div className="container">
          <div className="about-stats-grid">
            {[
              { value: 10000, label: 'Active Students', suffix: '+' },
              { value: 500, label: 'Courses Available', suffix: '+' },
              { value: 50, label: 'Expert Instructors', suffix: '+' },
              { value: 95, label: 'Satisfaction Rate', suffix: '%' },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                className="about-stat-item"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <span className="about-stat-value">
                  <CountUpComponent end={stat.value} duration={3} />{stat.suffix}
                </span>
                <span className="about-stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-tech section">
        <div className="container">
          <div className="section-header">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Built with <span className="gradient-text">Modern Tech</span>
            </motion.h2>
            <p>Powered by the MERN stack for performance and scalability</p>
          </div>
          <div className="tech-grid">
            {['MongoDB', 'Express.js', 'React.js', 'Node.js'].map((tech, i) => (
              <motion.div 
                key={i} 
                className="tech-badge"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, background: 'var(--primary)', color: 'white' }}
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
