# Cấu trúc Nền tảng và Vai trò Người dùng

## 1. Kiến trúc Tổng thể Nền tảng

### 1.1 Mô hình Kiến trúc
Nền tảng được thiết kế theo mô hình kiến trúc 3 lớp:
- **Lớp Trình bày (Presentation Layer)**: Giao diện người dùng, tương tác với người dùng
- **Lớp Ứng dụng (Application Layer)**: Xử lý logic nghiệp vụ, quản lý quy trình đánh giá
- **Lớp Dữ liệu (Data Layer)**: Lưu trữ và quản lý dữ liệu

### 1.2 Thành phần Hệ thống
- **Máy chủ Web**: Xử lý yêu cầu HTTP, hiển thị giao diện người dùng
- **Máy chủ Ứng dụng**: Xử lý logic nghiệp vụ, tính toán đánh giá
- **Cơ sở dữ liệu**: Lưu trữ dữ liệu về chương trình đào tạo, học phần, đánh giá
- **Hệ thống Báo cáo**: Tạo báo cáo và biểu đồ phân tích
- **API Gateway**: Cung cấp API cho tích hợp với các hệ thống khác

### 1.3 Công nghệ Đề xuất
- **Frontend**: React.js, Bootstrap, Chart.js
- **Backend**: Node.js/Express hoặc Python/Django
- **Cơ sở dữ liệu**: PostgreSQL hoặc MongoDB
- **Báo cáo**: PDF.js, Excel.js
- **Bảo mật**: JWT, OAuth2

## 2. Vai trò Người dùng và Phân quyền

### 2.1 Quản trị viên Hệ thống (System Administrator)
#### 2.1.1 Mô tả
Quản trị viên hệ thống có quyền cao nhất trong nền tảng, chịu trách nhiệm quản lý người dùng, cấu hình hệ thống và bảo mật.

#### 2.1.2 Quyền hạn
- Quản lý người dùng và phân quyền
- Cấu hình hệ thống
- Quản lý dữ liệu nền
- Sao lưu và phục hồi dữ liệu
- Giám sát hoạt động hệ thống

### 2.2 Quản trị viên Chất lượng (Quality Administrator)
#### 2.2.1 Mô tả
Quản trị viên chất lượng là người thuộc Trung tâm Đảm bảo Chất lượng, chịu trách nhiệm thiết lập tiêu chuẩn đánh giá và giám sát quá trình đánh giá.

#### 2.2.2 Quyền hạn
- Thiết lập tiêu chuẩn đánh giá
- Quản lý chuẩn đầu ra chương trình (PLO/SLO)
- Quản lý ma trận CLO-PLO
- Giám sát quá trình đánh giá
- Phân tích kết quả và đề xuất cải tiến
- Tạo báo cáo kiểm định

### 2.3 Trưởng Khoa/Bộ môn (Department Chair)
#### 2.3.1 Mô tả
Trưởng Khoa/Bộ môn là người quản lý chương trình đào tạo và đội ngũ giảng viên trong khoa/bộ môn.

#### 2.3.2 Quyền hạn
- Xem báo cáo tổng hợp về mức độ đạt PLO
- Phê duyệt chuẩn đầu ra học phần (CLO)
- Phê duyệt ma trận CLO-PLO
- Ra quyết định cải tiến chương trình
- Quản lý giảng viên trong khoa/bộ môn

### 2.4 Giảng viên (Lecturer)
#### 2.4.1 Mô tả
Giảng viên là người trực tiếp giảng dạy học phần và đánh giá sinh viên.

#### 2.4.2 Quyền hạn
- Thiết lập CLO cho học phần
- Thiết lập nhóm đánh giá (midterm, final, etc.)
- Thiết lập ma trận câu hỏi-CLO
- Thiết lập rubric đánh giá
- Nhập điểm đánh giá
- Xem báo cáo về mức độ đạt CLO
- Cải tiến phương pháp giảng dạy

### 2.5 Sinh viên (Student)
#### 2.5.1 Mô tả
Sinh viên là đối tượng được đánh giá trong quá trình học tập.

#### 2.5.2 Quyền hạn
- Xem chuẩn đầu ra học phần (CLO)
- Xem kết quả đánh giá cá nhân
- Xem mức độ đạt CLO cá nhân
- Phản hồi về quá trình đánh giá

### 2.6 Lãnh đạo (Leadership)
#### 2.6.1 Mô tả
Lãnh đạo bao gồm Ban Giám hiệu và các cấp quản lý cao cấp của trường.

#### 2.6.2 Quyền hạn
- Xem báo cáo tổng hợp về mức độ đạt PLO
- Xem báo cáo so sánh giữa các khoa/bộ môn
- Xem báo cáo xu hướng theo thời gian
- Ra quyết định chiến lược về đảm bảo chất lượng

## 3. Luồng Công việc (Workflow)

### 3.1 Thiết lập Chuẩn đầu ra
1. Quản trị viên Chất lượng thiết lập chuẩn đầu ra chương trình (PLO/SLO)
2. Trưởng Khoa/Bộ môn phê duyệt chuẩn đầu ra chương trình
3. Giảng viên thiết lập chuẩn đầu ra học phần (CLO)
4. Trưởng Khoa/Bộ môn phê duyệt chuẩn đầu ra học phần
5. Giảng viên thiết lập ma trận CLO-PLO
6. Quản trị viên Chất lượng phê duyệt ma trận CLO-PLO

### 3.2 Thiết lập Đánh giá
1. Giảng viên thiết lập nhóm đánh giá (midterm, final, etc.)
2. Giảng viên thiết lập ma trận câu hỏi-CLO
3. Giảng viên thiết lập rubric đánh giá
4. Quản trị viên Chất lượng phê duyệt thiết lập đánh giá

### 3.3 Thực hiện Đánh giá
1. Giảng viên nhập điểm đánh giá
2. Hệ thống tính toán mức độ đạt CLO
3. Hệ thống tính toán mức độ đạt PLO
4. Giảng viên xem báo cáo về mức độ đạt CLO
5. Trưởng Khoa/Bộ môn xem báo cáo về mức độ đạt PLO
6. Quản trị viên Chất lượng phân tích kết quả và đề xuất cải tiến

### 3.4 Cải tiến Chất lượng
1. Giảng viên cải tiến phương pháp giảng dạy
2. Trưởng Khoa/Bộ môn ra quyết định cải tiến chương trình
3. Quản trị viên Chất lượng giám sát quá trình cải tiến
4. Lãnh đạo ra quyết định chiến lược về đảm bảo chất lượng

## 4. Cấu trúc Dữ liệu

### 4.1 Dữ liệu Chương trình
- **Chương trình đào tạo (Program)**: Thông tin về chương trình đào tạo
- **Chuẩn đầu ra chương trình (PLO/SLO)**: Chuẩn đầu ra của chương trình đào tạo
- **Học phần (Course)**: Thông tin về học phần
- **Chuẩn đầu ra học phần (CLO)**: Chuẩn đầu ra của học phần
- **Ma trận CLO-PLO**: Mối quan hệ giữa CLO và PLO

### 4.2 Dữ liệu Đánh giá
- **Nhóm đánh giá (Assessment Group)**: Thông tin về nhóm đánh giá
- **Câu hỏi/Tiêu chí (Question/Criteria)**: Thông tin về câu hỏi/tiêu chí đánh giá
- **Ma trận Câu hỏi-CLO**: Mối quan hệ giữa câu hỏi và CLO
- **Rubric**: Tiêu chí đánh giá chi tiết
- **Điểm số (Score)**: Điểm số của sinh viên

### 4.3 Dữ liệu Người dùng
- **Người dùng (User)**: Thông tin về người dùng
- **Vai trò (Role)**: Vai trò của người dùng
- **Quyền hạn (Permission)**: Quyền hạn của vai trò
- **Khoa/Bộ môn (Department)**: Thông tin về khoa/bộ môn
- **Lớp học (Class)**: Thông tin về lớp học

### 4.4 Dữ liệu Báo cáo
- **Báo cáo CLO (CLO Report)**: Báo cáo về mức độ đạt CLO
- **Báo cáo PLO (PLO Report)**: Báo cáo về mức độ đạt PLO
- **Báo cáo Xu hướng (Trend Report)**: Báo cáo xu hướng theo thời gian
- **Báo cáo So sánh (Comparison Report)**: Báo cáo so sánh giữa các khoa/bộ môn

## 5. Giao diện Người dùng

### 5.1 Giao diện Chung
- **Đăng nhập/Đăng xuất**: Giao diện đăng nhập/đăng xuất
- **Trang chủ**: Trang chủ với thông tin tổng quan
- **Thông báo**: Hệ thống thông báo
- **Hồ sơ cá nhân**: Thông tin cá nhân của người dùng
- **Trợ giúp**: Hướng dẫn sử dụng

### 5.2 Giao diện Quản trị
- **Quản lý người dùng**: Giao diện quản lý người dùng
- **Cấu hình hệ thống**: Giao diện cấu hình hệ thống
- **Quản lý dữ liệu nền**: Giao diện quản lý dữ liệu nền
- **Giám sát hệ thống**: Giao diện giám sát hệ thống

### 5.3 Giao diện Chất lượng
- **Quản lý PLO/SLO**: Giao diện quản lý chuẩn đầu ra chương trình
- **Quản lý ma trận CLO-PLO**: Giao diện quản lý ma trận CLO-PLO
- **Giám sát đánh giá**: Giao diện giám sát quá trình đánh giá
- **Phân tích kết quả**: Giao diện phân tích kết quả đánh giá
- **Tạo báo cáo kiểm định**: Giao diện tạo báo cáo kiểm định

### 5.4 Giao diện Giảng viên
- **Quản lý CLO**: Giao diện quản lý chuẩn đầu ra học phần
- **Quản lý nhóm đánh giá**: Giao diện quản lý nhóm đánh giá
- **Quản lý ma trận câu hỏi-CLO**: Giao diện quản lý ma trận câu hỏi-CLO
- **Quản lý rubric**: Giao diện quản lý rubric đánh giá
- **Nhập điểm**: Giao diện nhập điểm đánh giá
- **Xem báo cáo CLO**: Giao diện xem báo cáo về mức độ đạt CLO

### 5.5 Giao diện Sinh viên
- **Xem CLO**: Giao diện xem chuẩn đầu ra học phần
- **Xem kết quả đánh giá**: Giao diện xem kết quả đánh giá cá nhân
- **Xem mức độ đạt CLO**: Giao diện xem mức độ đạt CLO cá nhân
- **Phản hồi**: Giao diện phản hồi về quá trình đánh giá

## 6. Tích hợp Hệ thống

### 6.1 Tích hợp với Hệ thống Quản lý Học tập (LMS)
- Đồng bộ hóa dữ liệu về học phần
- Đồng bộ hóa dữ liệu về sinh viên
- Đồng bộ hóa dữ liệu về điểm số

### 6.2 Tích hợp với Hệ thống Quản lý Sinh viên (SIS)
- Đồng bộ hóa dữ liệu về sinh viên
- Đồng bộ hóa dữ liệu về chương trình đào tạo
- Đồng bộ hóa dữ liệu về học phần

### 6.3 Tích hợp với Hệ thống Báo cáo Kiểm định
- Xuất dữ liệu cho báo cáo kiểm định
- Tạo báo cáo theo định dạng yêu cầu của tổ chức kiểm định
- Theo dõi tiến trình kiểm định

### 6.4 API cho Bên thứ ba
- API để truy vấn dữ liệu về chuẩn đầu ra
- API để truy vấn dữ liệu về đánh giá
- API để truy vấn dữ liệu về báo cáo

## 7. Yêu cầu Đặc thù cho Khoa Cơ khí

### 7.1 Chuẩn đầu ra Đặc thù
- Hỗ trợ chuẩn đầu ra đặc thù cho ngành Cơ khí
- Hỗ trợ đánh giá kỹ năng thực hành
- Hỗ trợ đánh giá dự án thiết kế

### 7.2 Phương pháp Đánh giá Đặc thù
- Hỗ trợ đánh giá thực hành trong phòng thí nghiệm
- Hỗ trợ đánh giá dự án thiết kế
- Hỗ trợ đánh giá báo cáo kỹ thuật
- Hỗ trợ đánh giá thuyết trình và bảo vệ đồ án

### 7.3 Báo cáo Đặc thù
- Báo cáo về mức độ đạt chuẩn ABET
- Báo cáo về mức độ đạt chuẩn AUN-QA
- Báo cáo về kỹ năng thực hành
- Báo cáo về khả năng thiết kế
