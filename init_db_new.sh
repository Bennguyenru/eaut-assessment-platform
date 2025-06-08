#!/bin/bash

# Database initialization script for EAUT Assessment Platform

set -e

echo "Initializing database with sample data..."

# Import sample data
echo "Importing sample data..."
psql -U postgres -d eaut_assessment << 'EOF'

-- Insert roles
INSERT INTO roles (id, name, description, status) VALUES
('R001', 'System Administrator', 'Quản trị viên hệ thống', 'active'),
('R002', 'Quality Administrator', 'Quản trị viên chất lượng', 'active'),
('R003', 'Department Chair', 'Trưởng Khoa/Bộ môn', 'active'),
('R004', 'Lecturer', 'Giảng viên', 'active'),
('R005', 'Student', 'Sinh viên', 'active'),
('R006', 'Leadership', 'Lãnh đạo', 'active');

-- Insert departments
INSERT INTO departments (id, name, description, status) VALUES
('D001', 'Khoa Cơ khí', 'Khoa Cơ khí - Trường Đại học Công nghệ Đông Á', 'active');

-- Insert users with bcrypt hashed passwords (password: 'password')
INSERT INTO users (id, username, password, email, full_name, role_id, department_id, status) VALUES
('U001', 'admin', '$2a$10$TsGMcqafgwBGf2mRRD.weObSxrFp4H03fXJOtEE/QfnolOXqg2ZB.', 'admin@eaut.edu.vn', 'Quản trị viên', 'R001', NULL, 'active'),
('U002', 'quality_admin', '$2a$10$TsGMcqafgwBGf2mRRD.weObSxrFp4H03fXJOtEE/QfnolOXqg2ZB.', 'quality@eaut.edu.vn', 'Quản trị viên Chất lượng', 'R002', NULL, 'active'),
('U003', 'dept_chair', '$2a$10$TsGMcqafgwBGf2mRRD.weObSxrFp4H03fXJOtEE/QfnolOXqg2ZB.', 'chair@eaut.edu.vn', 'Trưởng Khoa Cơ khí', 'R003', 'D001', 'active'),
('U004', 'lecturer1', '$2a$10$TsGMcqafgwBGf2mRRD.weObSxrFp4H03fXJOtEE/QfnolOXqg2ZB.', 'lecturer1@eaut.edu.vn', 'Giảng viên 1', 'R004', 'D001', 'active'),
('U005', 'lecturer2', '$2a$10$TsGMcqafgwBGf2mRRD.weObSxrFp4H03fXJOtEE/QfnolOXqg2ZB.', 'lecturer2@eaut.edu.vn', 'Giảng viên 2', 'R004', 'D001', 'active'),
('U006', 'leadership1', '$2a$10$TsGMcqafgwBGf2mRRD.weObSxrFp4H03fXJOtEE/QfnolOXqg2ZB.', 'leadership1@eaut.edu.vn', 'Lãnh đạo 1', 'R006', NULL, 'active'),
('U007', 'leadership2', '$2a$10$TsGMcqafgwBGf2mRRD.weObSxrFp4H03fXJOtEE/QfnolOXqg2ZB.', 'leadership2@eaut.edu.vn', 'Lãnh đạo 2', 'R006', NULL, 'active'),
('U008', 'student1', '$2a$10$TsGMcqafgwBGf2mRRD.weObSxrFp4H03fXJOtEE/QfnolOXqg2ZB.', 'student1@eaut.edu.vn', 'Sinh viên 1', 'R005', 'D001', 'active');

-- Update department head
UPDATE departments SET head_id = 'U003' WHERE id = 'D001';

-- Insert programs
INSERT INTO programs (id, name, department, degree, credits, duration, description, status, version) VALUES
('ME2025', 'Kỹ thuật Cơ khí', 'Khoa Cơ khí', 'Kỹ sư', 150, 4.5, 'Chương trình đào tạo kỹ sư cơ khí với kiến thức và kỹ năng chuyên sâu về thiết kế, chế tạo và vận hành hệ thống cơ khí.', 'active', '2025.1');

-- Insert PLOs
INSERT INTO plos (id, program_id, code, description, bloom_level, category, status) VALUES
('PLO1', 'ME2025', 'PLO1', 'Áp dụng kiến thức toán học, khoa học và kỹ thuật để giải quyết các vấn đề cơ khí phức tạp.', 'Áp dụng', 'Kiến thức', 'active'),
('PLO2', 'ME2025', 'PLO2', 'Thiết kế và thực hiện thí nghiệm, phân tích và diễn giải dữ liệu để rút ra kết luận hợp lý.', 'Phân tích', 'Kỹ năng', 'active'),
('PLO3', 'ME2025', 'PLO3', 'Thiết kế hệ thống, thành phần hoặc quy trình cơ khí đáp ứng nhu cầu thực tế với các ràng buộc về kinh tế, môi trường, xã hội, chính trị, đạo đức, sức khỏe và an toàn.', 'Sáng tạo', 'Kỹ năng', 'active'),
('PLO4', 'ME2025', 'PLO4', 'Làm việc hiệu quả trong các nhóm đa ngành và đa văn hóa.', 'Áp dụng', 'Kỹ năng mềm', 'active'),
('PLO5', 'ME2025', 'PLO5', 'Xác định, xây dựng và giải quyết các vấn đề kỹ thuật cơ khí.', 'Đánh giá', 'Kỹ năng', 'active'),
('PLO6', 'ME2025', 'PLO6', 'Hiểu biết về trách nhiệm nghề nghiệp và đạo đức.', 'Hiểu', 'Thái độ', 'active'),
('PLO7', 'ME2025', 'PLO7', 'Giao tiếp hiệu quả bằng văn bản, thuyết trình và trong các tình huống đàm phán.', 'Áp dụng', 'Kỹ năng mềm', 'active'),
('PLO8', 'ME2025', 'PLO8', 'Hiểu biết về tác động của các giải pháp kỹ thuật cơ khí trong bối cảnh toàn cầu, kinh tế, môi trường và xã hội.', 'Hiểu', 'Kiến thức', 'active'),
('PLO9', 'ME2025', 'PLO9', 'Nhận thức về nhu cầu học tập suốt đời và khả năng tham gia vào quá trình học tập suốt đời.', 'Hiểu', 'Thái độ', 'active'),
('PLO10', 'ME2025', 'PLO10', 'Sử dụng thành thạo các kỹ thuật, kỹ năng và công cụ kỹ thuật hiện đại cần thiết cho thực hành kỹ thuật cơ khí.', 'Áp dụng', 'Kỹ năng', 'active');

-- Insert courses
INSERT INTO courses (id, program_id, code, name, credits, description, prerequisites, semester, status) VALUES
('ME101', 'ME2025', 'ME101', 'Nhập môn Kỹ thuật Cơ khí', 3, 'Giới thiệu về ngành kỹ thuật cơ khí, các nguyên lý cơ bản và ứng dụng.', '[]', 1, 'active'),
('ME201', 'ME2025', 'ME201', 'Cơ học Vật rắn', 4, 'Nghiên cứu về lực, chuyển động và biến dạng của vật rắn.', '["ME101"]', 3, 'active'),
('ME301', 'ME2025', 'ME301', 'Thiết kế Máy', 4, 'Nguyên lý và phương pháp thiết kế các thành phần và hệ thống máy.', '["ME201"]', 5, 'active');

-- Insert CLOs
INSERT INTO clos (id, course_id, code, description, bloom_level, category, status) VALUES
('CLO1_ME101', 'ME101', 'CLO1', 'Mô tả các nguyên lý cơ bản của kỹ thuật cơ khí.', 'Hiểu', 'Kiến thức', 'active'),
('CLO2_ME101', 'ME101', 'CLO2', 'Xác định các thành phần cơ bản của hệ thống cơ khí.', 'Hiểu', 'Kiến thức', 'active'),
('CLO3_ME101', 'ME101', 'CLO3', 'Sử dụng các công cụ cơ bản trong kỹ thuật cơ khí.', 'Áp dụng', 'Kỹ năng', 'active'),
('CLO1_ME201', 'ME201', 'CLO1', 'Phân tích trạng thái ứng suất và biến dạng của vật rắn.', 'Phân tích', 'Kỹ năng', 'active'),
('CLO2_ME201', 'ME201', 'CLO2', 'Áp dụng các nguyên lý cơ học để giải quyết các bài toán kỹ thuật.', 'Áp dụng', 'Kỹ năng', 'active'),
('CLO3_ME201', 'ME201', 'CLO3', 'Thực hiện các thí nghiệm cơ học và phân tích kết quả.', 'Phân tích', 'Kỹ năng', 'active'),
('CLO1_ME301', 'ME301', 'CLO1', 'Thiết kế các thành phần cơ khí đáp ứng các yêu cầu kỹ thuật.', 'Sáng tạo', 'Kỹ năng', 'active'),
('CLO2_ME301', 'ME301', 'CLO2', 'Sử dụng phần mềm CAD để thiết kế và mô phỏng các thành phần cơ khí.', 'Áp dụng', 'Kỹ năng', 'active'),
('CLO3_ME301', 'ME301', 'CLO3', 'Đánh giá hiệu quả của các thiết kế cơ khí dựa trên các tiêu chí kỹ thuật và kinh tế.', 'Đánh giá', 'Kỹ năng', 'active');

-- Insert CLO-PLO matrix
INSERT INTO clo_plo_matrix (id, course_id, clo_id, plo_id, contribution_level) VALUES
('MAP1', 'ME101', 'CLO1_ME101', 'PLO1', 'medium'),
('MAP2', 'ME101', 'CLO2_ME101', 'PLO1', 'medium'),
('MAP3', 'ME101', 'CLO3_ME101', 'PLO10', 'high'),
('MAP4', 'ME201', 'CLO1_ME201', 'PLO1', 'high'),
('MAP5', 'ME201', 'CLO1_ME201', 'PLO5', 'medium'),
('MAP6', 'ME201', 'CLO2_ME201', 'PLO1', 'high'),
('MAP7', 'ME201', 'CLO3_ME201', 'PLO2', 'high'),
('MAP8', 'ME301', 'CLO1_ME301', 'PLO3', 'high'),
('MAP9', 'ME301', 'CLO2_ME301', 'PLO10', 'high'),
('MAP10', 'ME301', 'CLO3_ME301', 'PLO5', 'high');

-- Insert assessment groups
INSERT INTO assessment_groups (id, course_id, name, weight, description, status) VALUES
('AG1_ME101', 'ME101', 'Kiểm tra giữa kỳ', 0.3, 'Bài kiểm tra giữa kỳ đánh giá kiến thức cơ bản.', 'active'),
('AG2_ME101', 'ME101', 'Bài tập lớn', 0.2, 'Bài tập lớn về ứng dụng kỹ thuật cơ khí.', 'active'),
('AG3_ME101', 'ME101', 'Thi cuối kỳ', 0.5, 'Bài thi cuối kỳ đánh giá toàn bộ kiến thức và kỹ năng.', 'active'),
('AG1_ME201', 'ME201', 'Kiểm tra giữa kỳ', 0.25, 'Bài kiểm tra giữa kỳ đánh giá kiến thức cơ bản.', 'active'),
('AG2_ME201', 'ME201', 'Thí nghiệm', 0.25, 'Báo cáo thí nghiệm cơ học vật rắn.', 'active'),
('AG3_ME201', 'ME201', 'Thi cuối kỳ', 0.5, 'Bài thi cuối kỳ đánh giá toàn bộ kiến thức và kỹ năng.', 'active'),
('AG1_ME301', 'ME301', 'Kiểm tra giữa kỳ', 0.2, 'Bài kiểm tra giữa kỳ đánh giá kiến thức cơ bản.', 'active'),
('AG2_ME301', 'ME301', 'Đồ án thiết kế', 0.3, 'Đồ án thiết kế một hệ thống cơ khí.', 'active'),
('AG3_ME301', 'ME301', 'Thi cuối kỳ', 0.5, 'Bài thi cuối kỳ đánh giá toàn bộ kiến thức và kỹ năng.', 'active');

-- Insert questions/criteria
INSERT INTO questions (id, assessment_group_id, code, description, max_score, weight, type) VALUES
('Q1_AG1_ME101', 'AG1_ME101', 'Q1', 'Trình bày các nguyên lý cơ bản của kỹ thuật cơ khí.', 10, 0.5, 'essay'),
('Q2_AG1_ME101', 'AG1_ME101', 'Q2', 'Mô tả các thành phần cơ bản của một hệ thống cơ khí.', 10, 0.5, 'essay'),
('Q1_AG3_ME101', 'AG3_ME101', 'Q1', 'Phân tích ưu nhược điểm của các loại vật liệu cơ khí.', 10, 0.3, 'essay'),
('Q2_AG3_ME101', 'AG3_ME101', 'Q2', 'Giải thích nguyên lý hoạt động của một hệ thống cơ khí cụ thể.', 10, 0.3, 'essay'),
('Q3_AG3_ME101', 'AG3_ME101', 'Q3', 'Áp dụng kiến thức để giải quyết một vấn đề cơ khí đơn giản.', 10, 0.4, 'problem'),
('Q1_AG1_ME201', 'AG1_ME201', 'Q1', 'Phân tích trạng thái ứng suất của một vật thể chịu lực.', 10, 0.5, 'problem'),
('Q2_AG1_ME201', 'AG1_ME201', 'Q2', 'Tính toán biến dạng của một kết cấu đơn giản.', 10, 0.5, 'problem'),
('Q1_AG2_ME201', 'AG2_ME201', 'Q1', 'Thực hiện thí nghiệm đo ứng suất và biến dạng.', 10, 0.5, 'practical'),
('Q2_AG2_ME201', 'AG2_ME201', 'Q2', 'Phân tích và diễn giải kết quả thí nghiệm.', 10, 0.5, 'report'),
('Q1_AG1_ME301', 'AG1_ME301', 'Q1', 'Phân tích yêu cầu kỹ thuật của một hệ thống cơ khí.', 10, 0.5, 'essay'),
('Q2_AG1_ME301', 'AG1_ME301', 'Q2', 'Đánh giá hiệu quả của một thiết kế cơ khí.', 10, 0.5, 'essay'),
('Q1_AG2_ME301', 'AG2_ME301', 'Q1', 'Thiết kế một hệ thống cơ khí đáp ứng yêu cầu kỹ thuật.', 10, 0.6, 'project'),
('Q2_AG2_ME301', 'AG2_ME301', 'Q2', 'Thuyết trình và bảo vệ thiết kế.', 10, 0.4, 'presentation');

-- Insert question-CLO matrix
INSERT INTO question_clo_matrix (id, question_id, clo_id, contribution_level) VALUES
('QC1', 'Q1_AG1_ME101', 'CLO1_ME101', 'high'),
('QC2', 'Q2_AG1_ME101', 'CLO2_ME101', 'high'),
('QC3', 'Q1_AG3_ME101', 'CLO1_ME101', 'medium'),
('QC4', 'Q2_AG3_ME101', 'CLO2_ME101', 'high'),
('QC5', 'Q3_AG3_ME101', 'CLO3_ME101', 'high'),
('QC6', 'Q1_AG1_ME201', 'CLO1_ME201', 'high'),
('QC7', 'Q2_AG1_ME201', 'CLO2_ME201', 'high'),
('QC8', 'Q1_AG2_ME201', 'CLO3_ME201', 'high'),
('QC9', 'Q2_AG2_ME201', 'CLO3_ME201', 'high'),
('QC10', 'Q1_AG1_ME301', 'CLO1_ME301', 'medium'),
('QC11', 'Q2_AG1_ME301', 'CLO3_ME301', 'high'),
('QC12', 'Q1_AG2_ME301', 'CLO1_ME301', 'high'),
('QC13', 'Q2_AG2_ME301', 'CLO3_ME301', 'medium');

-- Insert classes
INSERT INTO classes (id, course_id, name, semester, lecturer_id, status) VALUES
('C001', 'ME101', 'ME101-01', '2025-1', 'U004', 'active'),
('C002', 'ME201', 'ME201-01', '2025-1', 'U005', 'active'),
('C003', 'ME301', 'ME301-01', '2025-1', 'U004', 'active');

-- Insert students
INSERT INTO students (id, user_id, student_code, program_id, cohort, status) VALUES
('SV001', 'U006', 'SV001', 'ME2025', '2025', 'active'),
('SV002', 'U007', 'SV002', 'ME2025', '2025', 'active');

-- Insert class enrollments
INSERT INTO class_enrollments (id, class_id, student_id) VALUES
('CE001', 'C001', 'SV001'),
('CE002', 'C001', 'SV002'),
('CE003', 'C002', 'SV001'),
('CE004', 'C002', 'SV002'),
('CE005', 'C003', 'SV001'),
('CE006', 'C003', 'SV002');

-- Insert scores
INSERT INTO scores (id, student_id, question_id, score) VALUES
('S1', 'SV001', 'Q1_AG1_ME101', 8.5),
('S2', 'SV001', 'Q2_AG1_ME101', 7.5),
('S3', 'SV001', 'Q1_AG3_ME101', 9.0),
('S4', 'SV001', 'Q2_AG3_ME101', 8.0),
('S5', 'SV001', 'Q3_AG3_ME101', 7.0),
('S6', 'SV002', 'Q1_AG1_ME101', 6.5),
('S7', 'SV002', 'Q2_AG1_ME101', 7.0),
('S8', 'SV002', 'Q1_AG3_ME101', 8.0),
('S9', 'SV002', 'Q2_AG3_ME101', 7.5),
('S10', 'SV002', 'Q3_AG3_ME101', 6.0);

-- Insert CLO reports
INSERT INTO clo_reports (id, course_id, class_id, semester, report_date) VALUES
('CR001', 'ME101', 'C001', '2025-1', '2025-06-30');

-- Insert CLO report results
INSERT INTO clo_report_results (id, clo_report_id, clo_id, total_students, passed_students, pass_rate, average_score) VALUES
('CRR1', 'CR001', 'CLO1_ME101', 30, 25, 0.83, 7.8),
('CRR2', 'CR001', 'CLO2_ME101', 30, 22, 0.73, 7.2),
('CRR3', 'CR001', 'CLO3_ME101', 30, 28, 0.93, 8.1);

-- Insert system settings
INSERT INTO system_settings (id, setting_key, setting_value, description) VALUES
('SS001', 'pass_threshold', '5.0', 'Ngưỡng điểm đạt (thang điểm 10)'),
('SS002', 'academic_year', '2025-2026', 'Năm học hiện tại'),
('SS003', 'current_semester', '2025-1', 'Học kỳ hiện tại');

EOF

echo "Database initialization completed."
