// server.js - Main server file for EAUT Assessment Platform

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const XLSX = require('xlsx');
const multer = require('multer');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
// Serve static files from the new directory structure
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
app.use('/logs', express.static(path.join(__dirname, '../../logs')));

// Database connection with improved error handling
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'eaut_assessment',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
  process.exit(-1);
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'eaut-assessment-platform-secret-key';

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel' ||
        file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel (.xlsx, .xls) and CSV files are allowed'), false);
    }
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Error handling middleware
const handleErrors = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation error', details: err.errors });
  }
  
  if (err.code === '23505') { // PostgreSQL unique constraint violation
    return res.status(409).json({ error: 'Resource already exists' });
  }
  
  if (err.code === '23503') { // PostgreSQL foreign key constraint violation
    return res.status(400).json({ error: 'Referenced resource does not exist' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
};

// Validation middleware
const validateLogin = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Routes

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Auth routes
app.post('/api/auth/login', validateLogin, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    console.log('Login attempt for username:', username);
    
    // Get user from database
    const userResult = await pool.query(
      'SELECT u.id, u.username, u.password, u.email, u.full_name, u.role_id, r.name as role_name, u.department_id ' +
      'FROM users u ' +
      'JOIN roles r ON u.role_id = r.id ' +
      'WHERE u.username = $1 AND u.status = $2',
      [username, 'active']
    );
    
    if (userResult.rows.length === 0) {
      console.log('User not found:', username);
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    const user = userResult.rows[0];
    console.log('User found, checking password for:', user.username);
    console.log('Input password:', password);
    console.log('Stored hash:', user.password);
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', username);
      // Try testing the hash generation
      const testHash = await bcrypt.hash(password, 10);
      console.log('Test hash for password "' + password + '":', testHash);
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        role: user.role_name,
        department_id: user.department_id
      }, 
      JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    
    // Return user info and token
    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role_name,
        departmentId: user.department_id,
        token: token
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Program routes
app.get('/api/programs', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM programs WHERE status = $1', ['active']);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/programs/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM programs WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Program not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/programs', authenticateToken, async (req, res) => {
  try {
    const { id, name, department, degree, credits, duration, description, status, version } = req.body;
    
    // Check if user has permission (Quality Admin or System Admin)
    if (req.user.role !== 'Quality Administrator' && req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const result = await pool.query(
      'INSERT INTO programs (id, name, department, degree, credits, duration, description, status, version) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [id, name, department, degree, credits, duration, description, status, version]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PLO routes
app.get('/api/programs/:programId/plos', authenticateToken, async (req, res) => {
  try {
    const { programId } = req.params;
    const result = await pool.query(
      'SELECT * FROM plos WHERE program_id = $1 AND status = $2',
      [programId, 'active']
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching PLOs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/plos', authenticateToken, async (req, res) => {
  try {
    const { id, program_id, code, description, bloom_level, category, status } = req.body;
    
    // Check if user has permission
    if (req.user.role !== 'Quality Administrator' && req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const result = await pool.query(
      'INSERT INTO plos (id, program_id, code, description, bloom_level, category, status) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id, program_id, code, description, bloom_level, category, status]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating PLO:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Course routes
app.get('/api/programs/:programId/courses', authenticateToken, async (req, res) => {
  try {
    const { programId } = req.params;
    const result = await pool.query(
      'SELECT * FROM courses WHERE program_id = $1 AND status = $2',
      [programId, 'active']
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/courses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/courses', authenticateToken, async (req, res) => {
  try {
    const { id, program_id, code, name, credits, description, prerequisites, semester, status } = req.body;
    
    // Check if user has permission
    if (req.user.role !== 'Department Chair' && req.user.role !== 'Quality Administrator' && req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const result = await pool.query(
      'INSERT INTO courses (id, program_id, code, name, credits, description, prerequisites, semester, status) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [id, program_id, code, name, credits, description, prerequisites, semester, status]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/courses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, credits, description, prerequisites, semester, status } = req.body;
    
    // Check if user has permission
    if (req.user.role !== 'Department Chair' && req.user.role !== 'Quality Administrator' && req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const result = await pool.query(
      'UPDATE courses SET code = $1, name = $2, credits = $3, description = $4, prerequisites = $5, semester = $6, status = $7, updated_at = CURRENT_TIMESTAMP ' +
      'WHERE id = $8 RETURNING *',
      [code, name, credits, description, prerequisites, semester, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/courses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user has permission
    if (req.user.role !== 'Department Chair' && req.user.role !== 'Quality Administrator' && req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const result = await pool.query(
      'UPDATE courses SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['inactive', id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// CLO routes
app.get('/api/courses/:courseId/clos', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await pool.query(
      'SELECT * FROM clos WHERE course_id = $1 AND status = $2',
      [courseId, 'active']
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching CLOs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/clos', authenticateToken, async (req, res) => {
  try {
    const { id, course_id, code, description, bloom_level, category, status } = req.body;
    
    // Check if user has permission (Lecturer or Department Chair)
    if (req.user.role !== 'Lecturer' && req.user.role !== 'Department Chair' && 
        req.user.role !== 'Quality Administrator' && req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const result = await pool.query(
      'INSERT INTO clos (id, course_id, code, description, bloom_level, category, status) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id, course_id, code, description, bloom_level, category, status]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating CLO:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// CLO-PLO Matrix routes
app.get('/api/courses/:courseId/clo-plo-matrix', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await pool.query(
      'SELECT cpm.*, c.code as clo_code, p.code as plo_code ' +
      'FROM clo_plo_matrix cpm ' +
      'JOIN clos c ON cpm.clo_id = c.id ' +
      'JOIN plos p ON cpm.plo_id = p.id ' +
      'WHERE cpm.course_id = $1',
      [courseId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching CLO-PLO matrix:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/clo-plo-matrix', authenticateToken, async (req, res) => {
  try {
    const { id, course_id, clo_id, plo_id, contribution_level } = req.body;
    
    // Check if user has permission
    if (req.user.role !== 'Lecturer' && req.user.role !== 'Department Chair' && 
        req.user.role !== 'Quality Administrator' && req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const result = await pool.query(
      'INSERT INTO clo_plo_matrix (id, course_id, clo_id, plo_id, contribution_level) ' +
      'VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, course_id, clo_id, plo_id, contribution_level]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating CLO-PLO mapping:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assessment Group routes
// Get all assessment groups (for management interface)
app.get('/api/assessment-groups', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT ag.*, c.code as course_code, c.name as course_name ' +
      'FROM assessment_groups ag ' +
      'JOIN courses c ON ag.course_id = c.id ' +
      'WHERE ag.status = $1',
      ['active']
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all assessment groups:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/courses/:courseId/assessment-groups', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await pool.query(
      'SELECT * FROM assessment_groups WHERE course_id = $1 AND status = $2',
      [courseId, 'active']
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching assessment groups:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/assessment-groups', authenticateToken, async (req, res) => {
  try {
    const { id, course_id, name, weight, description, status } = req.body;
    
    // Check if user has permission
    if (req.user.role !== 'Lecturer' && req.user.role !== 'Department Chair' && 
        req.user.role !== 'Quality Administrator' && req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const result = await pool.query(
      'INSERT INTO assessment_groups (id, course_id, name, weight, description, status) ' +
      'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, course_id, name, weight, description, status]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating assessment group:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/assessment-groups/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, weight, description, status } = req.body;
    
    // Check if user has permission
    if (req.user.role !== 'Lecturer' && req.user.role !== 'Department Chair' && 
        req.user.role !== 'Quality Administrator' && req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const result = await pool.query(
      'UPDATE assessment_groups SET name = $1, weight = $2, description = $3, status = $4, updated_at = CURRENT_TIMESTAMP ' +
      'WHERE id = $5 RETURNING *',
      [name, weight, description, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Assessment group not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating assessment group:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/assessment-groups/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user has permission
    if (req.user.role !== 'Lecturer' && req.user.role !== 'Department Chair' && 
        req.user.role !== 'Quality Administrator' && req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const result = await pool.query(
      'UPDATE assessment_groups SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['inactive', id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Assessment group not found' });
    }
    
    res.json({ message: 'Assessment group deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment group:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Questions routes
// Get all questions (for management interface)
app.get('/api/questions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT q.*, ag.name as assessment_group_name, c.code as course_code, c.name as course_name ' +
      'FROM questions q ' +
      'JOIN assessment_groups ag ON q.assessment_group_id = ag.id ' +
      'JOIN courses c ON ag.course_id = c.id ' +
      'ORDER BY c.code, ag.name, q.code'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all questions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/assessment-groups/:groupId/questions', authenticateToken, async (req, res) => {
  try {
    const { groupId } = req.params;
    const result = await pool.query(
      'SELECT * FROM questions WHERE assessment_group_id = $1',
      [groupId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/questions', authenticateToken, async (req, res) => {
  try {
    const { id, assessment_group_id, code, description, max_score, weight, type } = req.body;
    
    // Check if user has permission
    if (req.user.role !== 'Lecturer' && req.user.role !== 'Department Chair' && 
        req.user.role !== 'Quality Administrator' && req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const result = await pool.query(
      'INSERT INTO questions (id, assessment_group_id, code, description, max_score, weight, type) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id, assessment_group_id, code, description, max_score, weight, type]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/questions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { code, description, max_score, weight, type } = req.body;
    
    // Check if user has permission
    if (req.user.role !== 'Lecturer' && req.user.role !== 'Department Chair' && 
        req.user.role !== 'Quality Administrator' && req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const result = await pool.query(
      'UPDATE questions SET code = $1, description = $2, max_score = $3, weight = $4, type = $5, updated_at = CURRENT_TIMESTAMP ' +
      'WHERE id = $6 RETURNING *',
      [code, description, max_score, weight, type, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/questions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user has permission
    if (req.user.role !== 'Lecturer' && req.user.role !== 'Department Chair' && 
        req.user.role !== 'Quality Administrator' && req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const result = await pool.query(
      'DELETE FROM questions WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Scores routes
app.get('/api/classes/:classId/students/:studentId/scores', authenticateToken, async (req, res) => {
  try {
    const { classId, studentId } = req.params;
    
    // Get all questions for the class
    const questionsResult = await pool.query(
      'SELECT q.* FROM questions q ' +
      'JOIN assessment_groups ag ON q.assessment_group_id = ag.id ' +
      'JOIN courses c ON ag.course_id = c.id ' +
      'JOIN classes cl ON cl.course_id = c.id ' +
      'WHERE cl.id = $1',
      [classId]
    );
    
    const questions = questionsResult.rows;
    
    // Get scores for the student
    const scoresResult = await pool.query(
      'SELECT s.* FROM scores s ' +
      'WHERE s.student_id = $1 AND s.question_id IN (' +
      questions.map((q, i) => `$${i + 2}`).join(',') +
      ')',
      [studentId, ...questions.map(q => q.id)]
    );
    
    const scores = scoresResult.rows;
    
    // Combine questions with scores
    const result = questions.map(question => {
      const score = scores.find(s => s.question_id === question.id);
      return {
        question_id: question.id,
        question_code: question.code,
        question_description: question.description,
        max_score: question.max_score,
        score: score ? score.score : null
      };
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/scores', authenticateToken, async (req, res) => {
  try {
    const { id, student_id, question_id, score } = req.body;
    
    // Check if user has permission (Lecturer)
    if (req.user.role !== 'Lecturer' && req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    // Check if score already exists
    const existingScore = await pool.query(
      'SELECT * FROM scores WHERE student_id = $1 AND question_id = $2',
      [student_id, question_id]
    );
    
    let result;
    
    if (existingScore.rows.length > 0) {
      // Update existing score
      result = await pool.query(
        'UPDATE scores SET score = $1, updated_at = CURRENT_TIMESTAMP WHERE student_id = $2 AND question_id = $3 RETURNING *',
        [score, student_id, question_id]
      );
    } else {
      // Create new score
      result = await pool.query(
        'INSERT INTO scores (id, student_id, question_id, score) VALUES ($1, $2, $3, $4) RETURNING *',
        [id, student_id, question_id, score]
      );
    }
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// CLO Report routes
app.get('/api/courses/:courseId/classes/:classId/clo-report', authenticateToken, async (req, res) => {
  try {
    const { courseId, classId } = req.params;
    
    // Get CLOs for the course
    const closResult = await pool.query(
      'SELECT * FROM clos WHERE course_id = $1 AND status = $2',
      [courseId, 'active']
    );
    
    const clos = closResult.rows;
    
    // Get class information
    const classResult = await pool.query(
      'SELECT * FROM classes WHERE id = $1',
      [classId]
    );
    
    if (classResult.rows.length === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    const classInfo = classResult.rows[0];
    
    // Get all students in the class
    const studentsResult = await pool.query(
      'SELECT s.* FROM students s ' +
      'JOIN class_enrollments ce ON s.id = ce.student_id ' +
      'WHERE ce.class_id = $1',
      [classId]
    );
    
    const students = studentsResult.rows;
    const totalStudents = students.length;
    
    // Calculate CLO achievement for each CLO
    const cloResults = await Promise.all(clos.map(async (clo) => {
      // Get questions that assess this CLO
      const questionsResult = await pool.query(
        'SELECT q.* FROM questions q ' +
        'JOIN question_clo_matrix qcm ON q.id = qcm.question_id ' +
        'JOIN assessment_groups ag ON q.assessment_group_id = ag.id ' +
        'WHERE qcm.clo_id = $1 AND ag.course_id = $2',
        [clo.id, courseId]
      );
      
      const questions = questionsResult.rows;
      
      if (questions.length === 0) {
        return {
          clo_id: clo.id,
          clo_code: clo.code,
          total_students: totalStudents,
          passed_students: 0,
          pass_rate: 0,
          average_score: 0
        };
      }
      
      // Get scores for all students for these questions
      const scoresResult = await pool.query(
        'SELECT s.student_id, s.question_id, s.score, q.max_score, q.weight, qcm.contribution_level ' +
        'FROM scores s ' +
        'JOIN questions q ON s.question_id = q.id ' +
        'JOIN question_clo_matrix qcm ON q.id = qcm.question_id ' +
        'WHERE qcm.clo_id = $1 AND s.student_id IN (' +
        students.map((s, i) => `$${i + 3}`).join(',') +
        ')',
        [clo.id, courseId, ...students.map(s => s.id)]
      );
      
      const scores = scoresResult.rows;
      
      // Calculate CLO achievement for each student
      let passedStudents = 0;
      let totalScore = 0;
      
      students.forEach(student => {
        const studentScores = scores.filter(s => s.student_id === student.id);
        
        if (studentScores.length === 0) {
          return;
        }
        
        // Calculate weighted score for the student
        let weightedScore = 0;
        let totalWeight = 0;
        
        studentScores.forEach(score => {
          const contributionFactor = score.contribution_level === 'high' ? 1 : 
                                    score.contribution_level === 'medium' ? 0.6 : 0.3;
          
          weightedScore += (score.score / score.max_score) * score.weight * contributionFactor;
          totalWeight += score.weight * contributionFactor;
        });
        
        const finalScore = totalWeight > 0 ? (weightedScore / totalWeight) * 10 : 0;
        totalScore += finalScore;
        
        // Check if student passed the CLO (score >= 5.0)
        if (finalScore >= 5.0) {
          passedStudents++;
        }
      });
      
      const passRate = totalStudents > 0 ? passedStudents / totalStudents : 0;
      const averageScore = totalStudents > 0 ? totalScore / totalStudents : 0;
      
      return {
        clo_id: clo.id,
        clo_code: clo.code,
        clo_description: clo.description,
        total_students: totalStudents,
        passed_students: passedStudents,
        pass_rate: passRate,
        average_score: averageScore
      };
    }));
    
    // Create or update CLO report
    let reportId;
    const existingReportResult = await pool.query(
      'SELECT * FROM clo_reports WHERE course_id = $1 AND class_id = $2 AND semester = $3',
      [courseId, classId, classInfo.semester]
    );
    
    if (existingReportResult.rows.length > 0) {
      reportId = existingReportResult.rows[0].id;
    } else {
      const newReportResult = await pool.query(
        'INSERT INTO clo_reports (id, course_id, class_id, semester, report_date) ' +
        'VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING id',
        [`CR${Date.now()}`, courseId, classId, classInfo.semester]
      );
      reportId = newReportResult.rows[0].id;
    }
    
    // Save CLO results
    await Promise.all(cloResults.map(async (result) => {
      const existingResultResult = await pool.query(
        'SELECT * FROM clo_report_results WHERE clo_report_id = $1 AND clo_id = $2',
        [reportId, result.clo_id]
      );
      
      if (existingResultResult.rows.length > 0) {
        await pool.query(
          'UPDATE clo_report_results SET ' +
          'total_students = $1, passed_students = $2, pass_rate = $3, average_score = $4, updated_at = CURRENT_TIMESTAMP ' +
          'WHERE clo_report_id = $5 AND clo_id = $6',
          [result.total_students, result.passed_students, result.pass_rate, result.average_score, reportId, result.clo_id]
        );
      } else {
        await pool.query(
          'INSERT INTO clo_report_results (id, clo_report_id, clo_id, total_students, passed_students, pass_rate, average_score) ' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [`CRR${Date.now()}_${result.clo_id}`, reportId, result.clo_id, result.total_students, result.passed_students, result.pass_rate, result.average_score]
        );
      }
    }));
    
    res.json({
      report_id: reportId,
      course_id: courseId,
      class_id: classId,
      semester: classInfo.semester,
      report_date: new Date().toISOString().split('T')[0],
      clo_results: cloResults
    });
  } catch (error) {
    console.error('Error generating CLO report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PLO Report routes
app.get('/api/programs/:programId/plo-report', authenticateToken, async (req, res) => {
  try {
    const { programId } = req.params;
    const { cohort, academicYear } = req.query;
    
    if (!cohort || !academicYear) {
      return res.status(400).json({ message: 'Cohort and academic year are required' });
    }
    
    // Get PLOs for the program
    const plosResult = await pool.query(
      'SELECT * FROM plos WHERE program_id = $1 AND status = $2',
      [programId, 'active']
    );
    
    const plos = plosResult.rows;
    
    // Get all students in the program and cohort
    const studentsResult = await pool.query(
      'SELECT * FROM students WHERE program_id = $1 AND cohort = $2 AND status = $3',
      [programId, cohort, 'active']
    );
    
    const students = studentsResult.rows;
    const totalStudents = students.length;
    
    if (totalStudents === 0) {
      return res.status(404).json({ message: 'No students found for this program and cohort' });
    }
    
    // Calculate PLO achievement for each PLO
    const ploResults = await Promise.all(plos.map(async (plo) => {
      // Get CLOs that contribute to this PLO
      const closResult = await pool.query(
        'SELECT DISTINCT c.* FROM clos c ' +
        'JOIN clo_plo_matrix cpm ON c.id = cpm.clo_id ' +
        'WHERE cpm.plo_id = $1',
        [plo.id]
      );
      
      const clos = closResult.rows;
      
      if (clos.length === 0) {
        return {
          plo_id: plo.id,
          plo_code: plo.code,
          total_students: totalStudents,
          passed_students: 0,
          pass_rate: 0,
          average_score: 0
        };
      }
      
      // Get CLO achievement for each student
      let passedStudents = 0;
      let totalScore = 0;
      
      await Promise.all(students.map(async (student) => {
        let studentPloScore = 0;
        let totalContribution = 0;
        
        // For each CLO, get the student's achievement
        await Promise.all(clos.map(async (clo) => {
          // Get the contribution level of this CLO to the PLO
          const contributionResult = await pool.query(
            'SELECT contribution_level FROM clo_plo_matrix WHERE clo_id = $1 AND plo_id = $2',
            [clo.id, plo.id]
          );
          
          if (contributionResult.rows.length === 0) {
            return;
          }
          
          const contributionLevel = contributionResult.rows[0].contribution_level;
          const contributionFactor = contributionLevel === 'high' ? 1 : 
                                    contributionLevel === 'medium' ? 0.6 : 0.3;
          
          // Get questions that assess this CLO
          const questionsResult = await pool.query(
            'SELECT q.* FROM questions q ' +
            'JOIN question_clo_matrix qcm ON q.id = qcm.question_id ' +
            'WHERE qcm.clo_id = $1',
            [clo.id]
          );
          
          const questions = questionsResult.rows;
          
          if (questions.length === 0) {
            return;
          }
          
          // Get scores for the student for these questions
          const scoresResult = await pool.query(
            'SELECT s.*, q.max_score, q.weight, qcm.contribution_level ' +
            'FROM scores s ' +
            'JOIN questions q ON s.question_id = q.id ' +
            'JOIN question_clo_matrix qcm ON q.id = qcm.question_id ' +
            'WHERE qcm.clo_id = $1 AND s.student_id = $2',
            [clo.id, student.id]
          );
          
          const scores = scoresResult.rows;
          
          if (scores.length === 0) {
            return;
          }
          
          // Calculate CLO achievement for the student
          let weightedScore = 0;
          let totalWeight = 0;
          
          scores.forEach(score => {
            const scoreContributionFactor = score.contribution_level === 'high' ? 1 : 
                                          score.contribution_level === 'medium' ? 0.6 : 0.3;
            
            weightedScore += (score.score / score.max_score) * score.weight * scoreContributionFactor;
            totalWeight += score.weight * scoreContributionFactor;
          });
          
          const cloScore = totalWeight > 0 ? (weightedScore / totalWeight) * 10 : 0;
          
          // Add to PLO score with appropriate contribution
          studentPloScore += cloScore * contributionFactor;
          totalContribution += contributionFactor;
        }));
        
        // Calculate final PLO score for the student
        const finalPloScore = totalContribution > 0 ? studentPloScore / totalContribution : 0;
        totalScore += finalPloScore;
        
        // Check if student passed the PLO (score >= 5.0)
        if (finalPloScore >= 5.0) {
          passedStudents++;
        }
      }));
      
      const passRate = totalStudents > 0 ? passedStudents / totalStudents : 0;
      const averageScore = totalStudents > 0 ? totalScore / totalStudents : 0;
      
      return {
        plo_id: plo.id,
        plo_code: plo.code,
        plo_description: plo.description,
        total_students: totalStudents,
        passed_students: passedStudents,
        pass_rate: passRate,
        average_score: averageScore
      };
    }));
    
    // Create or update PLO report
    let reportId;
    const existingReportResult = await pool.query(
      'SELECT * FROM plo_reports WHERE program_id = $1 AND cohort = $2 AND academic_year = $3',
      [programId, cohort, academicYear]
    );
    
    if (existingReportResult.rows.length > 0) {
      reportId = existingReportResult.rows[0].id;
    } else {
      const newReportResult = await pool.query(
        'INSERT INTO plo_reports (id, program_id, cohort, academic_year, report_date) ' +
        'VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING id',
        [`PR${Date.now()}`, programId, cohort, academicYear]
      );
      reportId = newReportResult.rows[0].id;
    }
    
    // Save PLO results
    await Promise.all(ploResults.map(async (result) => {
      const existingResultResult = await pool.query(
        'SELECT * FROM plo_report_results WHERE plo_report_id = $1 AND plo_id = $2',
        [reportId, result.plo_id]
      );
      
      if (existingResultResult.rows.length > 0) {
        await pool.query(
          'UPDATE plo_report_results SET ' +
          'total_students = $1, passed_students = $2, pass_rate = $3, average_score = $4, updated_at = CURRENT_TIMESTAMP ' +
          'WHERE plo_report_id = $5 AND plo_id = $6',
          [result.total_students, result.passed_students, result.pass_rate, result.average_score, reportId, result.plo_id]
        );
      } else {
        await pool.query(
          'INSERT INTO plo_report_results (id, plo_report_id, plo_id, total_students, passed_students, pass_rate, average_score) ' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [`PRR${Date.now()}_${result.plo_id}`, reportId, result.plo_id, result.total_students, result.passed_students, result.pass_rate, result.average_score]
        );
      }
    }));
    
    res.json({
      report_id: reportId,
      program_id: programId,
      cohort: cohort,
      academic_year: academicYear,
      report_date: new Date().toISOString().split('T')[0],
      plo_results: ploResults
    });
  } catch (error) {
    console.error('Error generating PLO report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User management routes
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    // Check if user has permission
    if (req.user.role !== 'System Administrator' && req.user.role !== 'Quality Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const result = await pool.query(
      'SELECT u.id, u.username, u.email, u.full_name, u.status, r.name as role_name, d.name as department_name ' +
      'FROM users u ' +
      'JOIN roles r ON u.role_id = r.id ' +
      'LEFT JOIN departments d ON u.department_id = d.id ' +
      'WHERE u.status != $1',
      ['deleted']
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/users', authenticateToken, async (req, res) => {
  try {
    const { id, username, password, email, full_name, role_id, department_id, status } = req.body;
    
    // Check if user has permission
    if (req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (id, username, password, email, full_name, role_id, department_id, status) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, username, email, full_name, status',
      [id, username, hashedPassword, email, full_name, role_id, department_id, status]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, full_name, role_id, department_id, status } = req.body;
    
    // Check if user has permission
    if (req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2, full_name = $3, role_id = $4, department_id = $5, status = $6, updated_at = CURRENT_TIMESTAMP ' +
      'WHERE id = $7 RETURNING id, username, email, full_name, status',
      [username, email, full_name, role_id, department_id, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user has permission
    if (req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    // Don't allow deleting the current user
    if (req.user.id === id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    // Soft delete - set status to 'deleted'
    const result = await pool.query(
      'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
      ['deleted', id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Department management routes
app.get('/api/departments', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT d.*, u.full_name as head_name FROM departments d ' +
      'LEFT JOIN users u ON d.head_id = u.id ' +
      'WHERE d.status = $1',
      ['active']
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/departments', authenticateToken, async (req, res) => {
  try {
    const { id, name, description, head_id, status } = req.body;
    
    // Check if user has permission
    if (req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const result = await pool.query(
      'INSERT INTO departments (id, name, description, head_id, status) ' +
      'VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, name, description, head_id, status]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/departments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, head_id, status } = req.body;
    
    // Check if user has permission
    if (req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const result = await pool.query(
      'UPDATE departments SET name = $1, description = $2, head_id = $3, status = $4, updated_at = CURRENT_TIMESTAMP ' +
      'WHERE id = $5 RETURNING *',
      [name, description, head_id, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/departments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user has permission
    if (req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    // Soft delete - set status to 'inactive'
    const result = await pool.query(
      'UPDATE departments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['inactive', id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Roles management routes
app.get('/api/roles', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM roles WHERE status = $1',
      ['active']
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Students and Classes routes
app.get('/api/students', authenticateToken, async (req, res) => {
  try {
    const { program_id, cohort } = req.query;
    
    let query = 'SELECT s.*, u.full_name, u.email, p.name as program_name FROM students s ' +
                'JOIN users u ON s.user_id = u.id ' +
                'JOIN programs p ON s.program_id = p.id ' +
                'WHERE s.status = $1';
    
    const params = ['active'];
    
    if (program_id) {
      query += ' AND s.program_id = $2';
      params.push(program_id);
    }
    
    if (cohort) {
      query += ' AND s.cohort = $' + (params.length + 1);
      params.push(cohort);
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/classes', authenticateToken, async (req, res) => {
  try {
    const { course_id, lecturer_id } = req.query;
    
    let query = 'SELECT cl.*, c.name as course_name, c.code as course_code, u.full_name as lecturer_name ' +
                'FROM classes cl ' +
                'JOIN courses c ON cl.course_id = c.id ' +
                'JOIN users u ON cl.lecturer_id = u.id ' +
                'WHERE cl.status = $1';
    
    const params = ['active'];
    
    if (course_id) {
      query += ' AND cl.course_id = $2';
      params.push(course_id);
    }
    
    if (lecturer_id) {
      query += ' AND cl.lecturer_id = $' + (params.length + 1);
      params.push(lecturer_id);
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk score upload endpoint
app.post('/api/scores/bulk-upload', authenticateToken, upload.single('scoresFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check if user has permission (Lecturer)
    if (req.user.role !== 'Lecturer' && req.user.role !== 'System Administrator') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const row of jsonData) {
      try {
        const { student_id, question_id, score } = row;
        
        if (!student_id || !question_id || score === undefined) {
          throw new Error('Missing required fields');
        }

        // Check if score already exists
        const existingScore = await pool.query(
          'SELECT * FROM scores WHERE student_id = $1 AND question_id = $2',
          [student_id, question_id]
        );

        if (existingScore.rows.length > 0) {
          // Update existing score
          await pool.query(
            'UPDATE scores SET score = $1, updated_at = CURRENT_TIMESTAMP WHERE student_id = $2 AND question_id = $3',
            [score, student_id, question_id]
          );
        } else {
          // Create new score
          await pool.query(
            'INSERT INTO scores (id, student_id, question_id, score) VALUES ($1, $2, $3, $4)',
            [`SC${Date.now()}_${student_id}_${question_id}`, student_id, question_id, score]
          );
        }

        successCount++;
      } catch (error) {
        errorCount++;
        errors.push({
          row: row,
          error: error.message
        });
      }
    }

    res.json({
      message: 'Bulk upload completed',
      successCount,
      errorCount,
      errors: errors.length > 0 ? errors.slice(0, 10) : [] // Return first 10 errors
    });

  } catch (error) {
    console.error('Error in bulk upload:', error);
    res.status(500).json({ message: 'Server error during bulk upload' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(handleErrors);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end(() => {
    console.log('Database connection pool closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  pool.end(() => {
    console.log('Database connection pool closed');
    process.exit(0);
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 EAUT Assessment Platform server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Access the application at: http://localhost:${PORT}`);
});

// Handle server startup errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

module.exports = app;
