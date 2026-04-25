import { Link } from 'react-router-dom';
import { FiClock, FiUsers, FiStar, FiBookOpen } from 'react-icons/fi';
import './CourseCard.css';

const CourseCard = ({ course, index = 0 }) => {
  const defaultThumbnail = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800';

  return (
    <div
      className="course-card animate-fadeIn"
      style={{ animationDelay: `${index * 0.1}s` }}
      id={`course-card-${course._id}`}
    >
      <Link to={`/courses/${course._id}`} className="course-card-link">
        <div className="course-card-image">
          <img
            src={course.thumbnail || defaultThumbnail}
            alt={course.title}
            onError={(e) => { e.target.src = defaultThumbnail; }}
          />
          <div className="course-card-overlay">
            <span className="badge badge-primary">{course.category}</span>
          </div>
          {course.price === 0 ? (
            <span className="course-price-tag free">Free</span>
          ) : (
            <span className="course-price-tag">${course.price}</span>
          )}
        </div>

        <div className="course-card-body">
          <div className="course-card-level">
            <span className={`level-badge ${course.level?.toLowerCase()}`}>
              {course.level || 'Beginner'}
            </span>
          </div>

          <h3 className="course-card-title">{course.title}</h3>

          <p className="course-card-desc">
            {course.description?.substring(0, 100)}
            {course.description?.length > 100 ? '...' : ''}
          </p>

          <div className="course-card-instructor">
            <div className="instructor-avatar">
              {course.instructor?.name?.charAt(0) || 'I'}
            </div>
            <span>{course.instructor?.name || 'Instructor'}</span>
          </div>

          <div className="course-card-meta">
            <span className="meta-item">
              <FiBookOpen /> {course.lessons?.length || 0} lessons
            </span>
            <span className="meta-item">
              <FiUsers /> {course.enrollmentCount || 0}
            </span>
            <span className="meta-item rating">
              <FiStar /> {course.rating?.toFixed(1) || '0.0'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;
