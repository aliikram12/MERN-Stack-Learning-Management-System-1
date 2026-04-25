import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';
import Loader from '../components/Loader';
import VideoPlayer from '../components/VideoPlayer';
import { FiBookOpen, FiClock, FiUsers, FiStar, FiUser, FiCheck, FiPlay, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState({ lessons: [], enrollments: [] });
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await courseService.getCourse(id);
        // Robust check for data nesting
        const courseData = res.data || res;
        setCourse(courseData);

        // Check enrollment if logged in as student
        if (user && user.role === 'student') {
          const enrollRes = await enrollmentService.checkEnrollment(id);
          const isEnrolled = enrollRes.isEnrolled || !!enrollRes.data;
          setIsEnrolled(isEnrolled);
          if (isEnrolled && enrollRes.data) {
            setEnrollmentStatus(enrollRes.data.status || 'pending');
          }
        }
      } catch (error) {
        toast.error('Course not found');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll');
      navigate('/login');
      return;
    }
    if (user.role !== 'student') {
      toast.error('Only students can enroll in courses');
      return;
    }

    setEnrolling(true);
    try {
      await enrollmentService.enroll(id);
      toast.success('Successfully requested enrollment! Waiting for approval.');
      setIsEnrolled(true);
      setEnrollmentStatus('pending');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handleLessonClick = (lesson) => {
    // If Admin or Instructor of this course, always allow
    const isInstructorOfThisCourse = user?.role === 'instructor' && course?.instructor?._id === user?._id;
    const isAdmin = user?.role === 'admin';
    
    if (isAdmin || isInstructorOfThisCourse || enrollmentStatus === 'approved') {
      if (lesson.videoUrl) {
        setActiveVideo(lesson);
      } else {
        toast.error('No video available for this lesson');
      }
    } else if (enrollmentStatus === 'pending') {
      toast.error('Enrollment pending approval. Please wait to access lessons.');
    } else {
      toast.error('Please enroll to access this content');
      document.getElementById('enroll-btn')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) return <Loader text="Loading course details..." />;
  if (!course || !course.title) return null;

  return (
    <div className="course-detail-page">
      {activeVideo && (
        <VideoPlayer 
          videoUrl={activeVideo.videoUrl} 
          title={activeVideo.title} 
          onClose={() => setActiveVideo(null)} 
        />
      )}

      {/* Course Hero */}
      <div className="course-hero">
        <div className="container">
          <div className="course-hero-grid">
            <div className="course-hero-info animate-fadeIn">
              <div className="course-hero-badges">
                <span className="badge badge-primary">{course.category}</span>
                <span className={`level-badge ${course.level?.toLowerCase()}`}>{course.level}</span>
              </div>
              <h1>{course.title}</h1>
              <p className="course-hero-desc">{course.description}</p>

              <div className="course-hero-meta">
                <span className="meta-item"><FiStar /> {course.rating?.toFixed(1) || '0.0'} rating</span>
                <span className="meta-item"><FiUsers /> {course.enrollmentCount || 0} students</span>
                <span className="meta-item"><FiBookOpen /> {course.lessons?.length || 0} lessons</span>
              </div>

              <div className="course-hero-instructor">
                <div className="instructor-avatar-lg">
                  {course.instructor?.name?.charAt(0)}
                </div>
                <div>
                  <span className="instructor-label">Instructor</span>
                  <span className="instructor-name">{course.instructor?.name}</span>
                </div>
              </div>
            </div>

            <div className="course-hero-sidebar animate-slideInRight">
              <div className="course-sidebar-card">
                <div className="course-thumbnail">
                  <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} alt={course.title}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'; }} />
                </div>
                <div className="course-sidebar-body">
                  <div className="course-price-display">
                    {course.price === 0 ? (
                      <span className="price-free">Free</span>
                    ) : (
                      <span className="price-amount">${course.price}</span>
                    )}
                  </div>

                  {isEnrolled ? (
                    enrollmentStatus === 'pending' ? (
                      <button className="btn btn-warning btn-lg" style={{ width: '100%', background: '#f59e0b', color: 'white', border: 'none' }} disabled>
                        <FiClock /> Pending Approval
                      </button>
                    ) : enrollmentStatus === 'rejected' ? (
                      <button className="btn btn-danger btn-lg" style={{ width: '100%' }} disabled>
                        Rejected
                      </button>
                    ) : (
                      <button className="btn btn-success btn-lg" style={{ width: '100%' }} 
                        onClick={() => {
                          const firstLesson = course.lessons?.[0];
                          if (firstLesson) {
                            handleLessonClick(firstLesson);
                          } else {
                            toast.error('No lessons available in this course');
                          }
                        }}>
                        <FiPlay /> Go to Course
                      </button>
                    )
                  ) : (
                    <button className="btn btn-primary btn-lg" style={{ width: '100%' }}
                      onClick={handleEnroll} disabled={enrolling} id="enroll-btn">
                      {enrolling ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                           <Loader variant="small" /> Requesting...
                        </div>
                      ) : 'Enroll Now'}
                    </button>
                  )}

                  <ul className="course-includes">
                    <li><FiBookOpen /> {course.lessons?.length || 0} lessons</li>
                    <li><FiClock /> Self-paced learning</li>
                    <li><FiUser /> Full lifetime access</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="course-content-section section">
        <div className="container">
          <h2 className="content-section-title">Course Content</h2>
          <div className="lessons-list">
            {course.lessons?.length > 0 ? (
              course.lessons.map((lesson, index) => {
                const isInstructorOfThisCourse = user?.role === 'instructor' && course?.instructor?._id === user?._id;
                const isAdmin = user?.role === 'admin';
                const isLocked = !isAdmin && !isInstructorOfThisCourse && enrollmentStatus !== 'approved';

                return (
                  <div key={lesson._id || index} 
                    className={`lesson-item animate-fadeIn ${isLocked ? 'locked' : 'clickable'}`}
                    style={{ animationDelay: `${index * 0.08}s` }}
                    onClick={() => handleLessonClick(lesson)}
                  >
                    <div className="lesson-number">{index + 1}</div>
                    <div className="lesson-info">
                      <h4>{lesson.title}</h4>
                      <p>{(lesson.content || '').substring(0, 120)}{(lesson.content || '').length > 120 ? '...' : ''}</p>
                    </div>
                    <div className="lesson-meta">
                      {lesson.duration && <span className="lesson-duration"><FiClock /> {lesson.duration}</span>}
                      {isLocked ? (
                        <FiLock className="lesson-lock-icon" />
                      ) : (
                        <FiPlay className="lesson-play-icon" />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <p>No lessons available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
