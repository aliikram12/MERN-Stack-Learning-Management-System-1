import { useState, useEffect } from 'react';
import courseService from '../services/courseService';
import CourseCard from '../components/CourseCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import { FiFilter } from 'react-icons/fi';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [sort, setSort] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const categories = [
    '', 'Web Development', 'Mobile Development', 'Data Science',
    'Machine Learning', 'DevOps', 'Design', 'Business', 'Marketing', 'Other',
  ];

  const fetchCourses = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (level) params.level = level;
      if (sort) params.sort = sort;

      const res = await courseService.getCourses(params);
      setCourses(res.data);
      setPagination(res.pagination);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(1);
  }, [category, level, sort]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchCourses(1), 400);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="courses-page">
      <div className="container">
        <div className="page-header animate-fadeIn">
          <h1>Explore Courses</h1>
          <p>Discover {pagination.total} courses to advance your skills</p>
        </div>

        {/* Filters */}
        <div className="courses-toolbar animate-fadeIn">
          <div className="search-container">
            <SearchBar value={search} onChange={setSearch} placeholder="Search courses..." />
          </div>
          <div className="courses-filters">
            <select className="form-select filter-select" value={category}
              onChange={(e) => setCategory(e.target.value)} id="filter-category">
              <option value="">All Categories</option>
              {categories.filter(Boolean).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select className="form-select filter-select" value={level}
              onChange={(e) => setLevel(e.target.value)} id="filter-level">
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <select className="form-select filter-select" value={sort}
              onChange={(e) => setSort(e.target.value)} id="filter-sort">
              <option value="">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <Loader text="Loading courses..." />
        ) : courses.length === 0 ? (
          <div className="empty-state animate-fadeIn">
            <div className="empty-state-icon">📚</div>
            <h3>No courses found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="courses-grid">
              {courses.map((course, index) => (
                <CourseCard key={course._id} course={course} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="pagination">
                <button className="pagination-btn"
                  disabled={pagination.page === 1}
                  onClick={() => fetchCourses(pagination.page - 1)}>
                  ← Prev
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button key={page}
                    className={`pagination-btn ${pagination.page === page ? 'active' : ''}`}
                    onClick={() => fetchCourses(page)}>
                    {page}
                  </button>
                ))}
                <button className="pagination-btn"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => fetchCourses(pagination.page + 1)}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;
