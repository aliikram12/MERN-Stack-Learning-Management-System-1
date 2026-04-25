import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import courseService from '../../services/courseService';
import { FiPlus, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Web Development',
    level: 'Beginner', price: 0, thumbnail: '',
  });
  const [lessons, setLessons] = useState([]);
  const [lessonForm, setLessonForm] = useState({ title: '', content: '', duration: '', videoUrl: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const categories = [
    'Web Development', 'Mobile Development', 'Data Science',
    'Machine Learning', 'DevOps', 'Design', 'Business', 'Marketing', 'Other',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addLesson = async () => {
    if (!lessonForm.title || !lessonForm.content) {
      toast.error('Lesson title and content are required');
      return;
    }

    setUploading(true);
    let finalVideoUrl = lessonForm.videoUrl;

    try {
      // If a file was selected, upload it first
      if (videoFile) {
        toast.loading('Uploading video...', { id: 'upload-toast' });
        const uploadRes = await courseService.uploadFile(videoFile);
        finalVideoUrl = uploadRes.data;
        toast.success('Video uploaded!', { id: 'upload-toast' });
      }

      setLessons([...lessons, { ...lessonForm, videoUrl: finalVideoUrl, order: lessons.length + 1 }]);
      setLessonForm({ title: '', content: '', duration: '', videoUrl: '' });
      setVideoFile(null);
      toast.success('Lesson added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add lesson');
      toast.dismiss('upload-toast');
    } finally {
      setUploading(false);
    }
  };

  const removeLesson = (index) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }
    setLoading(true);
    try {
      const courseData = { ...formData, price: Number(formData.price), lessons };
      await courseService.createCourse(courseData);
      toast.success('Course created successfully!');
      navigate('/instructor/courses');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page-content">
      <div className="page-header">
        <h1>Create Course</h1>
        <p>Build a new course for your students</p>
      </div>

      <form onSubmit={handleSubmit} className="course-form glass-card animate-fadeIn">
        <div className="form-section">
          <h3 className="form-section-title">Course Details</h3>
          <div className="form-grid">
            <div className="form-group form-full">
              <label className="form-label">Course Title *</label>
              <input type="text" name="title" className="form-input" placeholder="e.g., Complete React Developer Course"
                value={formData.title} onChange={handleChange} />
            </div>
            <div className="form-group form-full">
              <label className="form-label">Description *</label>
              <textarea name="description" className="form-textarea" placeholder="Describe what students will learn..."
                value={formData.description} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Level</label>
              <select name="level" className="form-select" value={formData.level} onChange={handleChange}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input type="number" name="price" className="form-input" min="0" step="0.01"
                value={formData.price} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Thumbnail URL</label>
              <input type="text" name="thumbnail" className="form-input" placeholder="https://..."
                value={formData.thumbnail} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Lessons ({lessons.length})</h3>

          {lessons.map((lesson, i) => (
            <div key={i} className="lesson-item-form glass-card">
              <div className="lesson-item-header">
                <span className="lesson-number">{i + 1}</span>
                <strong>{lesson.title}</strong>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeLesson(i)}>
                  <FiX />
                </button>
              </div>
              <p className="lesson-item-content">{lesson.content.substring(0, 100)}...</p>
              {lesson.duration && <span className="lesson-item-duration">⏱ {lesson.duration}</span>}
            </div>
          ))}

          <div className="add-lesson-form glass-card" style={{ padding: 'var(--space-5)', marginTop: 'var(--space-6)', border: '1px dashed var(--primary)' }}>
            <h4>Add New Lesson</h4>
            <div className="form-group">
              <input type="text" className="form-input" placeholder="Lesson title"
                value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} />
            </div>
            <div className="form-group">
              <textarea className="form-textarea" placeholder="Lesson content" rows="3"
                value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })} />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <input type="text" className="form-input" placeholder="Duration (e.g. 10 mins)"
                  value={lessonForm.duration} onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })} />
              </div>
              <div className="form-group">
                <input type="text" className="form-input" placeholder="Video URL (YouTube/Direct)"
                  value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Or Upload Video File</label>
              <input type="file" className="form-input" accept="video/*" 
                onChange={(e) => setVideoFile(e.target.files[0])} />
            </div>

            <button type="button" className="btn btn-secondary" onClick={addLesson} disabled={uploading}>
              <FiPlus /> {uploading ? 'Processing...' : 'Add Lesson'}
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            <FiSave /> {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
