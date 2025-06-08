# 🌐 EAUT Assessment Platform - API Documentation

## 📋 API Overview

The EAUT Assessment Platform provides a comprehensive RESTful API built with Express.js, featuring enterprise-grade security, comprehensive validation, and detailed response formatting.

**Base URL**: `https://your-domain.com/api`  
**API Version**: `v1.0.0`  
**Authentication**: JWT Bearer Token  
**Content-Type**: `application/json`

## 🔐 Authentication & Security

### Authentication Flow
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "your_username",
      "role": "admin",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@eaut.edu.vn"
      }
    }
  },
  "message": "Login successful",
  "timestamp": "2025-06-09T10:30:00Z"
}
```

### Using Authentication
Include the JWT token in all authenticated requests:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚀 Core API Endpoints

### 🔐 Authentication Endpoints

#### User Authentication
```http
POST   /api/auth/login              # User login
POST   /api/auth/register           # New user registration
GET    /api/auth/profile            # Get current user profile
PUT    /api/auth/profile            # Update user profile
POST   /api/auth/logout             # Logout current user
POST   /api/auth/refresh            # Refresh JWT token
POST   /api/auth/forgot-password    # Request password reset
POST   /api/auth/reset-password     # Reset password
POST   /api/auth/change-password    # Change current password
```

#### Example: User Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "new_user",
  "password": "SecurePassword123!",
  "email": "user@eaut.edu.vn",
  "firstName": "New",
  "lastName": "User",
  "role": "lecturer",
  "departmentId": 1
}
```

### 👥 User Management Endpoints

#### User Operations
```http
GET    /api/users                   # List all users (admin only)
GET    /api/users/:id               # Get specific user details
PUT    /api/users/:id               # Update user information
DELETE /api/users/:id               # Delete user account
POST   /api/users/bulk-import       # Bulk import users from Excel
GET    /api/users/export            # Export user list to Excel
GET    /api/users/search            # Search users by criteria
PUT    /api/users/:id/role          # Update user role (admin only)
PUT    /api/users/:id/status        # Activate/deactivate user
```

#### Example: Get Users with Pagination
```http
GET /api/users?page=1&limit=20&role=lecturer&department=engineering

Response:
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 95,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 🎓 Program Management Endpoints

#### Program Operations
```http
GET    /api/programs                # List all programs
POST   /api/programs                # Create new program
GET    /api/programs/:id            # Get program details
PUT    /api/programs/:id            # Update program
DELETE /api/programs/:id            # Archive program
GET    /api/programs/:id/stats      # Get program statistics
POST   /api/programs/:id/clone      # Clone existing program
GET    /api/programs/:id/courses    # Get program courses
POST   /api/programs/:id/outcomes   # Add program learning outcome
```

#### Example: Create New Program
```http
POST /api/programs
Content-Type: application/json

{
  "name": "Computer Engineering",
  "code": "CE2025",
  "description": "Bachelor of Computer Engineering Program",
  "duration": 4,
  "creditHours": 150,
  "departmentId": 1,
  "startDate": "2025-09-01",
  "status": "active"
}
```

### 📚 Course Management Endpoints

#### Course Operations
```http
GET    /api/courses                 # List all courses
POST   /api/courses                 # Create new course
GET    /api/courses/:id             # Get course details
PUT    /api/courses/:id             # Update course
DELETE /api/courses/:id             # Archive course
GET    /api/courses/:id/outcomes    # Get course learning outcomes
POST   /api/courses/:id/enroll      # Enroll students in course
GET    /api/courses/:id/students    # Get enrolled students
POST   /api/courses/:id/assessments # Create course assessment
GET    /api/courses/search          # Search courses
```

#### Example: Create Course with Learning Outcomes
```http
POST /api/courses
Content-Type: application/json

{
  "name": "Data Structures and Algorithms",
  "code": "CS301",
  "credits": 3,
  "programId": 1,
  "semester": "Fall 2025",
  "description": "Introduction to fundamental data structures and algorithms",
  "prerequisites": ["CS201", "MATH201"],
  "learningOutcomes": [
    {
      "code": "CLO1",
      "description": "Analyze time and space complexity of algorithms",
      "weight": 0.25
    },
    {
      "code": "CLO2", 
      "description": "Implement fundamental data structures",
      "weight": 0.35
    }
  ]
}
```

### 🎯 Learning Outcomes Management

#### PLO (Program Learning Outcomes)
```http
GET    /api/outcomes/plo            # List program learning outcomes
POST   /api/outcomes/plo            # Create new PLO
GET    /api/outcomes/plo/:id        # Get PLO details
PUT    /api/outcomes/plo/:id        # Update PLO
DELETE /api/outcomes/plo/:id        # Delete PLO
```

#### CLO (Course Learning Outcomes)
```http
GET    /api/outcomes/clo            # List course learning outcomes
POST   /api/outcomes/clo            # Create new CLO
GET    /api/outcomes/clo/:id        # Get CLO details
PUT    /api/outcomes/clo/:id        # Update CLO
DELETE /api/outcomes/clo/:id        # Delete CLO
```

#### PLO-CLO Mapping
```http
GET    /api/outcomes/mapping        # Get PLO-CLO mappings
POST   /api/outcomes/mapping        # Create new mapping
PUT    /api/outcomes/mapping/:id    # Update mapping
DELETE /api/outcomes/mapping/:id    # Delete mapping
GET    /api/outcomes/matrix         # Get mapping matrix view
POST   /api/outcomes/matrix/export  # Export matrix to Excel
```

### 📊 Assessment Management

#### Assessment Operations
```http
GET    /api/assessments             # List all assessments
POST   /api/assessments             # Create new assessment
GET    /api/assessments/:id         # Get assessment details
PUT    /api/assessments/:id         # Update assessment
DELETE /api/assessments/:id         # Delete assessment
POST   /api/assessments/bulk        # Bulk grade entry
GET    /api/assessments/results     # Get assessment results
POST   /api/assessments/:id/grades  # Enter grades for assessment
GET    /api/assessments/:id/stats   # Get assessment statistics
```

#### Example: Create Assessment with Grading Criteria
```http
POST /api/assessments
Content-Type: application/json

{
  "courseId": 1,
  "name": "Midterm Examination",
  "type": "exam",
  "weight": 0.3,
  "totalMarks": 100,
  "assessmentDate": "2025-10-15",
  "criteria": [
    {
      "cloId": 1,
      "marks": 40,
      "description": "Algorithm analysis problems"
    },
    {
      "cloId": 2,
      "marks": 60,
      "description": "Data structure implementation"
    }
  ]
}
```

### 📈 Analytics & Reporting

#### Dashboard Analytics
```http
GET    /api/analytics/dashboard      # Main dashboard data
GET    /api/analytics/trends         # Performance trends
GET    /api/analytics/heatmap        # Performance heatmap
GET    /api/analytics/comparison     # Comparative analysis
GET    /api/analytics/predictions    # AI-powered predictions
```

#### Report Generation
```http
GET    /api/reports/program/:id      # Program performance report
GET    /api/reports/course/:id       # Course performance report
GET    /api/reports/outcome/:id      # Outcome achievement report
GET    /api/reports/student/:id      # Individual student report
POST   /api/reports/custom          # Generate custom report
GET    /api/reports/:id/download     # Download generated report
```

#### Example: Generate Custom Report
```http
POST /api/reports/custom
Content-Type: application/json

{
  "title": "Fall 2025 Engineering Program Assessment",
  "type": "program_assessment",
  "parameters": {
    "programId": 1,
    "semester": "Fall 2025",
    "includeGraphs": true,
    "format": "pdf"
  },
  "filters": {
    "courses": [1, 2, 3],
    "outcomes": ["PLO1", "PLO2", "PLO3"],
    "dateRange": {
      "start": "2025-09-01",
      "end": "2025-12-31"
    }
  }
}
```

### 📁 File Operations

#### File Upload & Management
```http
POST   /api/upload/excel            # Upload Excel assessment data
POST   /api/upload/documents        # Upload course documents
POST   /api/upload/avatar           # Upload user avatar
GET    /api/files/:id               # Get file details
DELETE /api/files/:id               # Delete file
GET    /api/files/download/:id      # Download file
```

#### Data Export
```http
GET    /api/exports/excel/:type     # Export data to Excel
GET    /api/exports/pdf/:reportId   # Export report to PDF
GET    /api/exports/csv/:dataType   # Export data to CSV
POST   /api/exports/custom          # Custom data export
```

### ⚡ System Operations

#### System Health & Monitoring
```http
GET    /api/health                  # Basic health check
GET    /api/status                  # Detailed system status
GET    /api/metrics                 # Performance metrics
GET    /api/logs                    # System logs (admin only)
POST   /api/backup                  # Create database backup
GET    /api/backup/status           # Backup status
```

#### Example: System Status Response
```json
{
  "success": true,
  "data": {
    "system": {
      "status": "healthy",
      "uptime": 2592000,
      "version": "1.0.0",
      "environment": "production"
    },
    "database": {
      "status": "connected",
      "responseTime": 15,
      "activeConnections": 12
    },
    "performance": {
      "cpuUsage": 18.5,
      "memoryUsage": 67.2,
      "diskUsage": 45.8
    },
    "features": {
      "authentication": "operational",
      "fileUpload": "operational",
      "notifications": "operational",
      "reports": "operational"
    }
  }
}
```

## 📋 API Response Standards

### Success Response Format
```json
{
  "success": true,
  "data": {
    // Response data object or array
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-06-09T10:30:00Z",
  "meta": {
    "requestId": "req_123456789",
    "processingTime": 125
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": {
      "field": "email",
      "value": "invalid-email",
      "constraint": "Must be a valid email address"
    }
  },
  "timestamp": "2025-06-09T10:30:00Z",
  "meta": {
    "requestId": "req_123456789",
    "endpoint": "/api/users"
  }
}
```

### Pagination Response Format
```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 195,
    "itemsPerPage": 20,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🔒 Security & Rate Limiting

### Authentication Requirements
- **JWT Token**: Required for all authenticated endpoints
- **Token Expiry**: 24 hours (configurable)
- **Refresh Token**: 30 days (configurable)
- **Rate Limiting**: 100 requests per 15 minutes per IP

### Permission Levels
| Role | Level | Access |
|------|-------|--------|
| **System Admin** | 10 | Full system access |
| **Quality Admin** | 8 | Quality management |
| **Department Head** | 6 | Department oversight |
| **Program Coordinator** | 5 | Program management |
| **Lecturer** | 3 | Course management |
| **Student** | 1 | Personal data only |

### Security Headers
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

## 🧪 Testing & Examples

### Using cURL
```bash
# Login
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Get programs with authentication
curl -X GET https://your-domain.com/api/programs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Using JavaScript (Frontend)
```javascript
// Login and store token
const login = async (username, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    return data.data.user;
  }
  throw new Error(data.error.message);
};

// Authenticated API call
const getPrograms = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/programs', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  return await response.json();
};
```

## 📊 API Metrics & Performance

### Performance Targets
- **Response Time**: <200ms average
- **Throughput**: 1000 requests/second
- **Availability**: 99.9% uptime
- **Error Rate**: <0.1%

### Monitoring Endpoints
```http
GET /api/metrics/performance    # Performance statistics
GET /api/metrics/usage         # API usage statistics
GET /api/metrics/errors        # Error rate analysis
```

---

**API Documentation Version**: 1.0.0  
**Last Updated**: June 9, 2025  
**Status**: ✅ Production Ready

For additional support or questions about the API, please refer to the [GitHub Issues](https://github.com/Bennguyenru/eaut-assessment-platform/issues) or contact the development team.
