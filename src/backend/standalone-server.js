// standalone-server.js - Self-contained server for executable deployment

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const fs = require('fs');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory database for standalone version
let inMemoryDB = {
    users: [
        {
            id: 1,
            username: 'admin',
            password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            email: 'admin@eaut.edu.vn',
            role: 'admin',
            full_name: 'System Administrator',
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            username: 'teacher',
            password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            email: 'teacher@eaut.edu.vn',
            role: 'teacher',
            full_name: 'Demo Teacher',
            created_at: new Date().toISOString()
        }
    ],
    programs: [
        {
            id: 1,
            program_code: 'ME2024',
            program_name: 'Mechanical Engineering',
            program_name_en: 'Mechanical Engineering',
            description: 'Mechanical Engineering Program',
            created_by: 1,
            created_at: new Date().toISOString()
        }
    ],
    plos: [
        {
            id: 1,
            program_id: 1,
            plo_code: 'PLO1',
            plo_description: 'Knowledge and Understanding',
            plo_description_en: 'Graduates demonstrate comprehensive knowledge and understanding of mechanical engineering principles',
            created_at: new Date().toISOString()
        }
    ],
    courses: [
        {
            id: 1,
            program_id: 1,
            course_code: 'ME101',
            course_name: 'Introduction to Mechanical Engineering',
            course_name_en: 'Introduction to Mechanical Engineering',
            credits: 3,
            created_at: new Date().toISOString()
        }
    ],
    clos: [],
    assessments: [],
    assessment_results: []
};

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
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the correct directory structure
const frontendPath = path.join(__dirname, 'frontend');
app.use(express.static(frontendPath));
app.use('/css', express.static(path.join(frontendPath, 'css')));
app.use('/js', express.static(path.join(frontendPath, 'js')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/logs', express.static(path.join(__dirname, 'logs')));

// Create directories if they don't exist
const dirs = ['uploads', 'logs'];
dirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'eaut-assessment-platform-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        mode: 'standalone',
        database: 'in-memory'
    });
});

// Authentication endpoints
app.post('/api/auth/login', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        
        // Find user in memory
        const user = inMemoryDB.users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                role: user.role 
            },
            process.env.JWT_SECRET || 'eaut-assessment-platform-secret-key',
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                full_name: user.full_name
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Programs endpoints
app.get('/api/programs', authenticateToken, (req, res) => {
    res.json(inMemoryDB.programs);
});

app.post('/api/programs', authenticateToken, [
    body('program_code').notEmpty().withMessage('Program code is required'),
    body('program_name').notEmpty().withMessage('Program name is required')
], (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newProgram = {
            id: inMemoryDB.programs.length + 1,
            ...req.body,
            created_by: req.user.id,
            created_at: new Date().toISOString()
        };

        inMemoryDB.programs.push(newProgram);
        res.status(201).json(newProgram);

    } catch (error) {
        console.error('Create program error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PLOs endpoints
app.get('/api/programs/:program_id/plos', authenticateToken, (req, res) => {
    const programId = parseInt(req.params.program_id);
    const plos = inMemoryDB.plos.filter(plo => plo.program_id === programId);
    res.json(plos);
});

app.post('/api/programs/:program_id/plos', authenticateToken, [
    body('plo_code').notEmpty().withMessage('PLO code is required'),
    body('plo_description').notEmpty().withMessage('PLO description is required')
], (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const programId = parseInt(req.params.program_id);
        const newPLO = {
            id: inMemoryDB.plos.length + 1,
            program_id: programId,
            ...req.body,
            created_at: new Date().toISOString()
        };

        inMemoryDB.plos.push(newPLO);
        res.status(201).json(newPLO);

    } catch (error) {
        console.error('Create PLO error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Courses endpoints
app.get('/api/programs/:program_id/courses', authenticateToken, (req, res) => {
    const programId = parseInt(req.params.program_id);
    const courses = inMemoryDB.courses.filter(course => course.program_id === programId);
    res.json(courses);
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
    res.json({
        total_programs: inMemoryDB.programs.length,
        total_plos: inMemoryDB.plos.length,
        total_courses: inMemoryDB.courses.length,
        total_assessments: inMemoryDB.assessments.length,
        recent_activity: [
            {
                action: 'System started',
                timestamp: new Date().toISOString(),
                user: 'System'
            }
        ]
    });
});

// Handle SPA routing - serve index.html for any non-API routes
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(frontendPath, 'index.html'));
    } else {
        res.status(404).json({ error: 'API endpoint not found' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log('🎓 EAUT Assessment Platform - Standalone Version');
    console.log('==============================================');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('📊 Database: In-Memory (Standalone Mode)');
    console.log('👤 Default Login: admin / password');
    console.log('🔧 Mode: Production Standalone');
    console.log('');
    console.log('🌐 Open your browser to: http://localhost:3000');
    console.log('⏹️  Press Ctrl+C to stop the server');
    console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down EAUT Assessment Platform...');
    console.log('👋 Goodbye!');
    process.exit(0);
});

module.exports = app;
