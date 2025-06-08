const { body, param, query, validationResult } = require('express-validator');

// Common validation rules
const commonValidators = {
    id: param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
    email: body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    password: body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    name: body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    description: body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
    page: query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    limit: query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
};

// Authentication validation
const authValidation = {
    login: [
        commonValidators.email,
        body('password').notEmpty().withMessage('Password is required')
    ],
    
    register: [
        commonValidators.name,
        commonValidators.email,
        commonValidators.password,
        body('role').optional().isIn(['admin', 'teacher', 'student']).withMessage('Role must be admin, teacher, or student'),
        body('department').optional().trim().isLength({ max: 100 }).withMessage('Department must not exceed 100 characters')
    ],
    
    changePassword: [
        body('currentPassword').notEmpty().withMessage('Current password is required'),
        commonValidators.password.withMessage('New password must meet security requirements')
    ]
};

// PLO validation
const ploValidation = {
    create: [
        body('code').trim().isLength({ min: 1, max: 20 }).withMessage('PLO code is required and must not exceed 20 characters'),
        body('title').trim().isLength({ min: 1, max: 200 }).withMessage('PLO title is required and must not exceed 200 characters'),
        commonValidators.description,
        body('program_id').isInt({ min: 1 }).withMessage('Valid program ID is required'),
        body('level').optional().isIn(['basic', 'intermediate', 'advanced']).withMessage('Level must be basic, intermediate, or advanced')
    ],
    
    update: [
        commonValidators.id,
        body('code').optional().trim().isLength({ min: 1, max: 20 }).withMessage('PLO code must not exceed 20 characters'),
        body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('PLO title must not exceed 200 characters'),
        commonValidators.description,
        body('level').optional().isIn(['basic', 'intermediate', 'advanced']).withMessage('Level must be basic, intermediate, or advanced')
    ]
};

// CLO validation
const cloValidation = {
    create: [
        body('code').trim().isLength({ min: 1, max: 20 }).withMessage('CLO code is required and must not exceed 20 characters'),
        body('title').trim().isLength({ min: 1, max: 200 }).withMessage('CLO title is required and must not exceed 200 characters'),
        commonValidators.description,
        body('course_id').isInt({ min: 1 }).withMessage('Valid course ID is required'),
        body('plo_ids').isArray({ min: 1 }).withMessage('At least one PLO must be associated'),
        body('plo_ids.*').isInt({ min: 1 }).withMessage('All PLO IDs must be valid integers')
    ],
    
    update: [
        commonValidators.id,
        body('code').optional().trim().isLength({ min: 1, max: 20 }).withMessage('CLO code must not exceed 20 characters'),
        body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('CLO title must not exceed 200 characters'),
        commonValidators.description,
        body('plo_ids').optional().isArray().withMessage('PLO IDs must be an array'),
        body('plo_ids.*').optional().isInt({ min: 1 }).withMessage('All PLO IDs must be valid integers')
    ]
};

// Assessment validation
const assessmentValidation = {
    create: [
        body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Assessment title is required and must not exceed 200 characters'),
        commonValidators.description,
        body('type').isIn(['exam', 'assignment', 'project', 'presentation', 'other']).withMessage('Assessment type must be exam, assignment, project, presentation, or other'),
        body('total_score').isFloat({ min: 0, max: 1000 }).withMessage('Total score must be between 0 and 1000'),
        body('course_id').isInt({ min: 1 }).withMessage('Valid course ID is required'),
        body('clo_ids').isArray({ min: 1 }).withMessage('At least one CLO must be assessed'),
        body('clo_ids.*').isInt({ min: 1 }).withMessage('All CLO IDs must be valid integers'),
        body('assessment_date').optional().isISO8601().withMessage('Assessment date must be a valid date')
    ],
    
    update: [
        commonValidators.id,
        body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Assessment title must not exceed 200 characters'),
        commonValidators.description,
        body('type').optional().isIn(['exam', 'assignment', 'project', 'presentation', 'other']).withMessage('Assessment type must be exam, assignment, project, presentation, or other'),
        body('total_score').optional().isFloat({ min: 0, max: 1000 }).withMessage('Total score must be between 0 and 1000'),
        body('clo_ids').optional().isArray().withMessage('CLO IDs must be an array'),
        body('clo_ids.*').optional().isInt({ min: 1 }).withMessage('All CLO IDs must be valid integers'),
        body('assessment_date').optional().isISO8601().withMessage('Assessment date must be a valid date')
    ]
};

// Course validation
const courseValidation = {
    create: [
        body('code').trim().isLength({ min: 1, max: 20 }).withMessage('Course code is required and must not exceed 20 characters'),
        body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Course title is required and must not exceed 200 characters'),
        commonValidators.description,
        body('credits').isInt({ min: 1, max: 10 }).withMessage('Credits must be between 1 and 10'),
        body('program_id').isInt({ min: 1 }).withMessage('Valid program ID is required'),
        body('semester').optional().isIn(['1', '2', '3', '4', '5', '6', '7', '8']).withMessage('Semester must be between 1 and 8'),
        body('prerequisite_ids').optional().isArray().withMessage('Prerequisite IDs must be an array'),
        body('prerequisite_ids.*').optional().isInt({ min: 1 }).withMessage('All prerequisite IDs must be valid integers')
    ],
    
    update: [
        commonValidators.id,
        body('code').optional().trim().isLength({ min: 1, max: 20 }).withMessage('Course code must not exceed 20 characters'),
        body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Course title must not exceed 200 characters'),
        commonValidators.description,
        body('credits').optional().isInt({ min: 1, max: 10 }).withMessage('Credits must be between 1 and 10'),
        body('semester').optional().isIn(['1', '2', '3', '4', '5', '6', '7', '8']).withMessage('Semester must be between 1 and 8'),
        body('prerequisite_ids').optional().isArray().withMessage('Prerequisite IDs must be an array'),
        body('prerequisite_ids.*').optional().isInt({ min: 1 }).withMessage('All prerequisite IDs must be valid integers')
    ]
};

// Student score validation
const scoreValidation = {
    submit: [
        body('student_id').isInt({ min: 1 }).withMessage('Valid student ID is required'),
        body('assessment_id').isInt({ min: 1 }).withMessage('Valid assessment ID is required'),
        body('score').isFloat({ min: 0 }).withMessage('Score must be a non-negative number'),
        body('clo_scores').isArray({ min: 1 }).withMessage('CLO scores are required'),
        body('clo_scores.*.clo_id').isInt({ min: 1 }).withMessage('Valid CLO ID is required'),
        body('clo_scores.*.score').isFloat({ min: 0 }).withMessage('CLO score must be a non-negative number'),
        body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must not exceed 500 characters')
    ],
    
    bulk: [
        body('assessment_id').isInt({ min: 1 }).withMessage('Valid assessment ID is required'),
        body('scores').isArray({ min: 1 }).withMessage('Scores array is required'),
        body('scores.*.student_id').isInt({ min: 1 }).withMessage('Valid student ID is required'),
        body('scores.*.score').isFloat({ min: 0 }).withMessage('Score must be a non-negative number'),
        body('scores.*.clo_scores').isArray({ min: 1 }).withMessage('CLO scores are required'),
        body('scores.*.clo_scores.*.clo_id').isInt({ min: 1 }).withMessage('Valid CLO ID is required'),
        body('scores.*.clo_scores.*.score').isFloat({ min: 0 }).withMessage('CLO score must be a non-negative number')
    ]
};

// Report validation
const reportValidation = {
    generate: [
        query('type').isIn(['plo', 'clo', 'course', 'program', 'student']).withMessage('Report type must be plo, clo, course, program, or student'),
        query('period_start').optional().isISO8601().withMessage('Period start must be a valid date'),
        query('period_end').optional().isISO8601().withMessage('Period end must be a valid date'),
        query('program_id').optional().isInt({ min: 1 }).withMessage('Program ID must be a positive integer'),
        query('course_id').optional().isInt({ min: 1 }).withMessage('Course ID must be a positive integer'),
        query('format').optional().isIn(['json', 'csv', 'excel']).withMessage('Format must be json, csv, or excel')
    ]
};

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(error => ({
            field: error.path,
            message: error.msg,
            value: error.value
        }));
        
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors
        });
    }
    
    next();
};

// File upload validation
const fileValidation = {
    scores: [
        body('assessment_id').isInt({ min: 1 }).withMessage('Valid assessment ID is required'),
        // File validation will be handled by multer middleware
    ],
    
    validateFileFormat: (allowedTypes = ['xlsx', 'csv']) => {
        return (req, res, next) => {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }
            
            const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
            
            if (!allowedTypes.includes(fileExtension)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid file format. Allowed formats: ${allowedTypes.join(', ')}`
                });
            }
            
            // Check file size (5MB max)
            if (req.file.size > 5 * 1024 * 1024) {
                return res.status(400).json({
                    success: false,
                    message: 'File size must not exceed 5MB'
                });
            }
            
            next();
        };
    }
};

// Custom validators
const customValidators = {
    // Check if score is within valid range for assessment
    scoreInRange: (assessmentId) => {
        return body('score').custom(async (value, { req }) => {
            // This would need database access to check max score
            // Implementation would go here
            return true;
        });
    },
    
    // Check if user has permission to access resource
    hasPermission: (resource, action = 'read') => {
        return (req, res, next) => {
            // Implementation would check user permissions
            // For now, just proceed
            next();
        };
    },
    
    // Validate date range
    dateRange: [
        query('start_date').optional().isISO8601().withMessage('Start date must be valid'),
        query('end_date').optional().isISO8601().withMessage('End date must be valid'),
        query('start_date').custom((value, { req }) => {
            if (value && req.query.end_date && new Date(value) > new Date(req.query.end_date)) {
                throw new Error('Start date must be before end date');
            }
            return true;
        })
    ]
};

module.exports = {
    authValidation,
    ploValidation,
    cloValidation,
    assessmentValidation,
    courseValidation,
    scoreValidation,
    reportValidation,
    fileValidation,
    customValidators,
    handleValidationErrors,
    commonValidators
};
