const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

/**
 * Database Seeder
 * Creates sample data for testing the application
 * Run: npm run seed
 */

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@lms.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create instructor users
    const instructor1 = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'sarah@lms.com',
      password: 'instructor123',
      role: 'instructor',
      bio: 'Full-Stack Developer with 10+ years of experience. Passionate about teaching modern web technologies.',
    });

    const instructor2 = await User.create({
      name: 'Prof. Michael Chen',
      email: 'michael@lms.com',
      password: 'instructor123',
      role: 'instructor',
      bio: 'Data Scientist and ML Engineer. Former researcher at Stanford AI Lab.',
    });

    // Create student users
    const student1 = await User.create({
      name: 'John Doe',
      email: 'john@lms.com',
      password: 'student123',
      role: 'student',
    });

    const student2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@lms.com',
      password: 'student123',
      role: 'student',
    });

    console.log('👤 Created users');

    // Create courses
    const courses = await Course.create([
      {
        title: 'Complete React Developer Course',
        description:
          'Master React.js from scratch. Learn hooks, context API, Redux, React Router, and build real-world projects. This comprehensive course covers everything you need to become a professional React developer.',
        instructor: instructor1._id,
        category: 'Web Development',
        level: 'Intermediate',
        price: 49.99,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        rating: 4.8,
        enrollmentCount: 234,
        lessons: [
          { title: 'Introduction to React', content: 'What is React and why is it popular? We explore the component-based architecture and virtual DOM.', duration: '15 mins', order: 1 },
          { title: 'JSX and Components', content: 'Learn JSX syntax, functional components, and how to structure your React application.', duration: '25 mins', order: 2 },
          { title: 'State and Props', content: 'Understanding state management with useState and passing data with props.', duration: '30 mins', order: 3 },
          { title: 'React Hooks Deep Dive', content: 'Master useEffect, useContext, useReducer, useMemo, and custom hooks.', duration: '45 mins', order: 4 },
          { title: 'React Router', content: 'Client-side routing, nested routes, dynamic routes, and navigation guards.', duration: '35 mins', order: 5 },
        ],
      },
      {
        title: 'Node.js & Express Masterclass',
        description:
          'Build scalable backend applications with Node.js and Express. Learn REST APIs, authentication, database integration, and deployment strategies.',
        instructor: instructor1._id,
        category: 'Web Development',
        level: 'Intermediate',
        price: 59.99,
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
        rating: 4.6,
        enrollmentCount: 189,
        lessons: [
          { title: 'Node.js Fundamentals', content: 'Understanding the event loop, modules, and async programming in Node.js.', duration: '20 mins', order: 1 },
          { title: 'Express.js Basics', content: 'Setting up Express, middleware, routing, and request/response handling.', duration: '30 mins', order: 2 },
          { title: 'RESTful API Design', content: 'Best practices for designing REST APIs with proper HTTP methods and status codes.', duration: '35 mins', order: 3 },
          { title: 'Authentication with JWT', content: 'Implementing secure authentication using JSON Web Tokens and bcrypt.', duration: '40 mins', order: 4 },
        ],
      },
      {
        title: 'Python for Data Science',
        description:
          'Learn Python programming for data analysis, visualization, and machine learning. Covers pandas, numpy, matplotlib, and scikit-learn.',
        instructor: instructor2._id,
        category: 'Data Science',
        level: 'Beginner',
        price: 39.99,
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
        rating: 4.9,
        enrollmentCount: 456,
        lessons: [
          { title: 'Python Basics', content: 'Variables, data types, control flow, and functions in Python.', duration: '25 mins', order: 1 },
          { title: 'NumPy Arrays', content: 'Working with numerical data using NumPy arrays and operations.', duration: '30 mins', order: 2 },
          { title: 'Pandas DataFrames', content: 'Data manipulation and analysis with Pandas.', duration: '40 mins', order: 3 },
        ],
      },
      {
        title: 'Machine Learning A-Z',
        description:
          'Comprehensive machine learning course covering supervised learning, unsupervised learning, deep learning, and practical applications with real datasets.',
        instructor: instructor2._id,
        category: 'Machine Learning',
        level: 'Advanced',
        price: 79.99,
        thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
        rating: 4.7,
        enrollmentCount: 312,
        lessons: [
          { title: 'Introduction to ML', content: 'Overview of machine learning concepts, types, and applications.', duration: '20 mins', order: 1 },
          { title: 'Linear Regression', content: 'Understanding and implementing linear regression from scratch.', duration: '35 mins', order: 2 },
          { title: 'Classification Algorithms', content: 'Decision trees, random forests, and SVM for classification tasks.', duration: '45 mins', order: 3 },
        ],
      },
      {
        title: 'UI/UX Design Fundamentals',
        description:
          'Learn the principles of user interface and user experience design. Master Figma, wireframing, prototyping, and design thinking methodology.',
        instructor: instructor1._id,
        category: 'Design',
        level: 'Beginner',
        price: 29.99,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        rating: 4.5,
        enrollmentCount: 167,
        lessons: [
          { title: 'Design Thinking', content: 'Understanding the design thinking process and user-centered design.', duration: '20 mins', order: 1 },
          { title: 'Color Theory', content: 'Working with colors, palettes, and contrast for effective UI design.', duration: '25 mins', order: 2 },
        ],
      },
      {
        title: 'DevOps with Docker & Kubernetes',
        description:
          'Master containerization and orchestration. Learn Docker, Kubernetes, CI/CD pipelines, and cloud deployment on AWS and GCP.',
        instructor: instructor2._id,
        category: 'DevOps',
        level: 'Advanced',
        price: 69.99,
        thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
        rating: 4.4,
        enrollmentCount: 98,
        lessons: [
          { title: 'Docker Fundamentals', content: 'Understanding containers, images, and Docker CLI.', duration: '30 mins', order: 1 },
          { title: 'Docker Compose', content: 'Multi-container applications with Docker Compose.', duration: '25 mins', order: 2 },
          { title: 'Kubernetes Basics', content: 'Pods, services, deployments, and kubectl commands.', duration: '40 mins', order: 3 },
        ],
      },
    ]);

    console.log('📚 Created courses');

    // Create enrollments
    await Enrollment.create([
      {
        student: student1._id,
        course: courses[0]._id,
        progress: 60,
        completedLessons: [courses[0].lessons[0]._id, courses[0].lessons[1]._id, courses[0].lessons[2]._id],
      },
      {
        student: student1._id,
        course: courses[2]._id,
        progress: 33,
        completedLessons: [courses[2].lessons[0]._id],
      },
      {
        student: student2._id,
        course: courses[0]._id,
        progress: 20,
        completedLessons: [courses[0].lessons[0]._id],
      },
      {
        student: student2._id,
        course: courses[3]._id,
        progress: 0,
      },
    ]);

    console.log('📝 Created enrollments');

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('   Admin:      admin@lms.com / admin123');
    console.log('   Instructor: sarah@lms.com / instructor123');
    console.log('   Instructor: michael@lms.com / instructor123');
    console.log('   Student:    john@lms.com / student123');
    console.log('   Student:    jane@lms.com / student123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
