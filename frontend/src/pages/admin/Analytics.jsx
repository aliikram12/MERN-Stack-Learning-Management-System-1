import { useState, useEffect } from 'react';
import enrollmentService from '../../services/enrollmentService';
import StatsCard from '../../components/StatsCard';
import Loader from '../../components/Loader';
import { FiUsers, FiBookOpen, FiAward, FiTrendingUp, FiUserCheck, FiClipboard } from 'react-icons/fi';
import '../Dashboard.css';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await enrollmentService.getAnalytics();
        setAnalytics(res.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Loader text="Loading analytics..." />;

  return (
    <div className="dashboard-page-content">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <p>Platform overview and statistics</p>
      </div>

      <div className="stats-grid animate-fadeIn">
        <StatsCard icon={<FiUsers />} label="Total Users" value={analytics?.totalUsers || 0} color="primary" delay={0} />
        <StatsCard icon={<FiUserCheck />} label="Students" value={analytics?.totalStudents || 0} color="info" delay={0.1} />
        <StatsCard icon={<FiClipboard />} label="Instructors" value={analytics?.totalInstructors || 0} color="warning" delay={0.2} />
        <StatsCard icon={<FiBookOpen />} label="Total Courses" value={analytics?.totalCourses || 0} color="success" delay={0.3} />
        <StatsCard icon={<FiAward />} label="Enrollments" value={analytics?.totalEnrollments || 0} color="primary" delay={0.4} />
        <StatsCard icon={<FiTrendingUp />} label="Last 30 Days" value={analytics?.recentEnrollments || 0} color="info" delay={0.5} />
      </div>

      {/* Category Distribution */}
      {analytics?.categoryDistribution?.length > 0 && (
        <div className="analytics-section animate-fadeIn" style={{ animationDelay: '0.4s', opacity: 0 }}>
          <h2 className="section-subtitle">Courses by Category</h2>
          <div className="category-chart">
            {analytics.categoryDistribution.map((cat, i) => (
              <div key={i} className="category-bar-item">
                <div className="category-bar-label">
                  <span>{cat._id}</span>
                  <span className="category-bar-count">{cat.count}</span>
                </div>
                <div className="category-bar-track">
                  <div className="category-bar-fill"
                    style={{
                      width: `${(cat.count / Math.max(...analytics.categoryDistribution.map(c => c.count))) * 100}%`,
                      animationDelay: `${i * 0.1}s`
                    }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
