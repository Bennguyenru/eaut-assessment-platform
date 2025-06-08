-- Database Schema for EAUT Assessment Platform

-- Programs Table
CREATE TABLE programs (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    degree VARCHAR(50) NOT NULL,
    credits INTEGER NOT NULL,
    duration FLOAT NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    version VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Program Learning Outcomes (PLO) Table
CREATE TABLE plos (
    id VARCHAR(20) PRIMARY KEY,
    program_id VARCHAR(20) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    bloom_level VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id)
);

-- Courses Table
CREATE TABLE courses (
    id VARCHAR(20) PRIMARY KEY,
    program_id VARCHAR(20) NOT NULL,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL,
    description TEXT,
    prerequisites TEXT,
    semester INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id)
);

-- Course Learning Outcomes (CLO) Table
CREATE TABLE clos (
    id VARCHAR(20) PRIMARY KEY,
    course_id VARCHAR(20) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    bloom_level VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- CLO-PLO Matrix Table
CREATE TABLE clo_plo_matrix (
    id VARCHAR(20) PRIMARY KEY,
    course_id VARCHAR(20) NOT NULL,
    clo_id VARCHAR(20) NOT NULL,
    plo_id VARCHAR(20) NOT NULL,
    contribution_level VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (clo_id) REFERENCES clos(id),
    FOREIGN KEY (plo_id) REFERENCES plos(id)
);

-- Assessment Groups Table
CREATE TABLE assessment_groups (
    id VARCHAR(20) PRIMARY KEY,
    course_id VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    weight FLOAT NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Questions/Criteria Table
CREATE TABLE questions (
    id VARCHAR(20) PRIMARY KEY,
    assessment_group_id VARCHAR(20) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    max_score FLOAT NOT NULL,
    weight FLOAT NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_group_id) REFERENCES assessment_groups(id)
);

-- Question-CLO Matrix Table
CREATE TABLE question_clo_matrix (
    id VARCHAR(20) PRIMARY KEY,
    question_id VARCHAR(20) NOT NULL,
    clo_id VARCHAR(20) NOT NULL,
    contribution_level VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id),
    FOREIGN KEY (clo_id) REFERENCES clos(id)
);

-- Rubrics Table
CREATE TABLE rubrics (
    id VARCHAR(20) PRIMARY KEY,
    question_id VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Rubric Criteria Table
CREATE TABLE rubric_criteria (
    id VARCHAR(20) PRIMARY KEY,
    rubric_id VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    weight FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rubric_id) REFERENCES rubrics(id)
);

-- Rubric Levels Table
CREATE TABLE rubric_levels (
    id VARCHAR(20) PRIMARY KEY,
    rubric_criteria_id VARCHAR(20) NOT NULL,
    score FLOAT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rubric_criteria_id) REFERENCES rubric_criteria(id)
);

-- Departments Table
CREATE TABLE departments (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    head_id VARCHAR(20),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles Table
CREATE TABLE roles (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE users (
    id VARCHAR(20) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role_id VARCHAR(20) NOT NULL,
    department_id VARCHAR(20),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Update Departments Table with Foreign Key
ALTER TABLE departments
ADD CONSTRAINT fk_departments_head
FOREIGN KEY (head_id) REFERENCES users(id);

-- Classes Table
CREATE TABLE classes (
    id VARCHAR(20) PRIMARY KEY,
    course_id VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    lecturer_id VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (lecturer_id) REFERENCES users(id)
);

-- Students Table
CREATE TABLE students (
    id VARCHAR(20) PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    student_code VARCHAR(20) NOT NULL UNIQUE,
    program_id VARCHAR(20) NOT NULL,
    cohort VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (program_id) REFERENCES programs(id)
);

-- Class Enrollments Table
CREATE TABLE class_enrollments (
    id VARCHAR(20) PRIMARY KEY,
    class_id VARCHAR(20) NOT NULL,
    student_id VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Scores Table
CREATE TABLE scores (
    id VARCHAR(20) PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    question_id VARCHAR(20) NOT NULL,
    score FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- CLO Reports Table
CREATE TABLE clo_reports (
    id VARCHAR(20) PRIMARY KEY,
    course_id VARCHAR(20) NOT NULL,
    class_id VARCHAR(20) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    report_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- CLO Report Results Table
CREATE TABLE clo_report_results (
    id VARCHAR(20) PRIMARY KEY,
    clo_report_id VARCHAR(20) NOT NULL,
    clo_id VARCHAR(20) NOT NULL,
    total_students INTEGER NOT NULL,
    passed_students INTEGER NOT NULL,
    pass_rate FLOAT NOT NULL,
    average_score FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clo_report_id) REFERENCES clo_reports(id),
    FOREIGN KEY (clo_id) REFERENCES clos(id)
);

-- PLO Reports Table
CREATE TABLE plo_reports (
    id VARCHAR(20) PRIMARY KEY,
    program_id VARCHAR(20) NOT NULL,
    cohort VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    report_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id)
);

-- PLO Report Results Table
CREATE TABLE plo_report_results (
    id VARCHAR(20) PRIMARY KEY,
    plo_report_id VARCHAR(20) NOT NULL,
    plo_id VARCHAR(20) NOT NULL,
    total_students INTEGER NOT NULL,
    passed_students INTEGER NOT NULL,
    pass_rate FLOAT NOT NULL,
    average_score FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plo_report_id) REFERENCES plo_reports(id),
    FOREIGN KEY (plo_id) REFERENCES plos(id)
);

-- Trend Reports Table
CREATE TABLE trend_reports (
    id VARCHAR(20) PRIMARY KEY,
    program_id VARCHAR(20) NOT NULL,
    report_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id)
);

-- Trend Report Data Table
CREATE TABLE trend_report_data (
    id VARCHAR(20) PRIMARY KEY,
    trend_report_id VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trend_report_id) REFERENCES trend_reports(id)
);

-- Trend Report Results Table
CREATE TABLE trend_report_results (
    id VARCHAR(20) PRIMARY KEY,
    trend_report_data_id VARCHAR(20) NOT NULL,
    plo_id VARCHAR(20) NOT NULL,
    pass_rate FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trend_report_data_id) REFERENCES trend_report_data(id),
    FOREIGN KEY (plo_id) REFERENCES plos(id)
);

-- Comparison Reports Table
CREATE TABLE comparison_reports (
    id VARCHAR(20) PRIMARY KEY,
    report_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comparison Report Data Table
CREATE TABLE comparison_report_data (
    id VARCHAR(20) PRIMARY KEY,
    comparison_report_id VARCHAR(20) NOT NULL,
    department_id VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comparison_report_id) REFERENCES comparison_reports(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Comparison Report Results Table
CREATE TABLE comparison_report_results (
    id VARCHAR(20) PRIMARY KEY,
    comparison_report_data_id VARCHAR(20) NOT NULL,
    plo_id VARCHAR(20) NOT NULL,
    pass_rate FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comparison_report_data_id) REFERENCES comparison_report_data(id),
    FOREIGN KEY (plo_id) REFERENCES plos(id)
);

-- System Settings Table
CREATE TABLE system_settings (
    id VARCHAR(20) PRIMARY KEY,
    setting_key VARCHAR(50) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id VARCHAR(20) PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(20) NOT NULL,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
