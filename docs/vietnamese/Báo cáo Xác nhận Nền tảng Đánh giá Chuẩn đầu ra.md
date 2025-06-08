# Báo cáo Xác nhận Nền tảng Đánh giá Chuẩn đầu ra

## Tổng quan

Báo cáo này trình bày kết quả xác nhận nền tảng đánh giá mức độ đạt chuẩn đầu ra chương trình đào tạo cho khoa Cơ khí trường Đại học Công nghệ Đông Á. Quá trình xác nhận bao gồm kiểm tra tính logic của nền tảng, tính khả dụng, và sự tuân thủ các tiêu chuẩn kiểm định chất lượng giáo dục.

## Xác nhận tính logic

### 1. Logic đánh giá CLO

Nền tảng đã được xác nhận để đảm bảo logic đánh giá CLO hoạt động chính xác:

- **Tính toán điểm CLO**: Hệ thống tính toán chính xác điểm CLO dựa trên điểm của các câu hỏi/tiêu chí đánh giá, có tính đến trọng số và mức độ đóng góp.
- **Xác định mức độ đạt**: Hệ thống xác định chính xác mức độ đạt CLO dựa trên ngưỡng điểm đạt được cấu hình.
- **Báo cáo CLO**: Hệ thống tạo báo cáo CLO chính xác, hiển thị tỷ lệ đạt và điểm trung bình cho từng CLO.

### 2. Logic đánh giá PLO

Nền tảng đã được xác nhận để đảm bảo logic đánh giá PLO hoạt động chính xác:

- **Tính toán điểm PLO**: Hệ thống tính toán chính xác điểm PLO dựa trên điểm CLO, có tính đến mức độ đóng góp của CLO đối với PLO.
- **Xác định mức độ đạt**: Hệ thống xác định chính xác mức độ đạt PLO dựa trên ngưỡng điểm đạt được cấu hình.
- **Báo cáo PLO**: Hệ thống tạo báo cáo PLO chính xác, hiển thị tỷ lệ đạt và điểm trung bình cho từng PLO.

### 3. Ma trận CLO-PLO

Nền tảng đã được xác nhận để đảm bảo ma trận CLO-PLO hoạt động chính xác:

- **Quản lý ma trận**: Hệ thống cho phép quản lý ma trận CLO-PLO một cách linh hoạt, với các mức độ đóng góp khác nhau.
- **Hiển thị ma trận**: Hệ thống hiển thị ma trận CLO-PLO một cách trực quan, giúp người dùng dễ dàng hiểu được mối quan hệ giữa CLO và PLO.
- **Sử dụng ma trận trong đánh giá**: Hệ thống sử dụng ma trận CLO-PLO một cách chính xác trong quá trình tính toán điểm PLO.

## Xác nhận tính khả dụng

### 1. Giao diện người dùng

Nền tảng đã được xác nhận để đảm bảo giao diện người dùng thân thiện và dễ sử dụng:

- **Thiết kế responsive**: Giao diện hoạt động tốt trên các thiết bị khác nhau, từ máy tính để bàn đến thiết bị di động.
- **Tính nhất quán**: Giao diện có tính nhất quán cao, với các thành phần UI được sử dụng nhất quán trong toàn bộ nền tảng.
- **Khả năng tiếp cận**: Giao diện đáp ứng các tiêu chuẩn về khả năng tiếp cận, giúp người dùng dễ dàng sử dụng nền tảng.

### 2. Luồng công việc

Nền tảng đã được xác nhận để đảm bảo luồng công việc hợp lý và hiệu quả:

- **Quản lý PLO/CLO**: Luồng công việc quản lý PLO/CLO được thiết kế hợp lý, giúp người dùng dễ dàng tạo, chỉnh sửa và xóa PLO/CLO.
- **Quản lý đánh giá**: Luồng công việc quản lý đánh giá được thiết kế hợp lý, giúp người dùng dễ dàng tạo, chỉnh sửa và xóa các nhóm đánh giá, câu hỏi/tiêu chí và rubric.
- **Nhập điểm và tạo báo cáo**: Luồng công việc nhập điểm và tạo báo cáo được thiết kế hợp lý, giúp người dùng dễ dàng nhập điểm và tạo báo cáo.

### 3. Phân quyền

Nền tảng đã được xác nhận để đảm bảo hệ thống phân quyền hoạt động chính xác:

- **Quản trị viên**: Quản trị viên có quyền truy cập đầy đủ vào tất cả các chức năng của nền tảng.
- **Quản trị viên chất lượng**: Quản trị viên chất lượng có quyền quản lý PLO, CLO, ma trận CLO-PLO và xem báo cáo.
- **Trưởng khoa**: Trưởng khoa có quyền quản lý CLO, ma trận CLO-PLO, đánh giá và xem báo cáo cho khoa của mình.
- **Giảng viên**: Giảng viên có quyền quản lý CLO, đánh giá, nhập điểm và xem báo cáo cho các lớp học của mình.
- **Sinh viên**: Sinh viên có quyền xem điểm và báo cáo CLO cho các lớp học của mình.

## Tuân thủ tiêu chuẩn kiểm định

Nền tảng đã được xác nhận để đảm bảo tuân thủ các tiêu chuẩn kiểm định chất lượng giáo dục:

### 1. AUN-QA

Nền tảng đáp ứng các yêu cầu của AUN-QA về đánh giá chuẩn đầu ra:

- **Tiêu chuẩn 1**: Kết quả học tập mong đợi (Expected Learning Outcomes)
- **Tiêu chuẩn 2**: Đặc tả chương trình (Program Specification)
- **Tiêu chuẩn 3**: Cấu trúc và nội dung chương trình (Programme Structure and Content)
- **Tiêu chuẩn 5**: Đánh giá người học (Student Assessment)

### 2. ABET

Nền tảng đáp ứng các yêu cầu của ABET về đánh giá chuẩn đầu ra:

- **Tiêu chí 2**: Mục tiêu giáo dục của chương trình (Program Educational Objectives)
- **Tiêu chí 3**: Kết quả học tập của sinh viên (Student Outcomes)
- **Tiêu chí 4**: Cải tiến liên tục (Continuous Improvement)

### 3. Thông tư 17/2021/TT-BGDĐT

Nền tảng đáp ứng các yêu cầu của Thông tư 17/2021/TT-BGDĐT về đánh giá chuẩn đầu ra:

- **Điều 5**: Chuẩn đầu ra của chương trình đào tạo
- **Điều 6**: Đánh giá kết quả học tập của người học
- **Điều 7**: Đánh giá chương trình đào tạo

## Kết luận

Nền tảng đánh giá mức độ đạt chuẩn đầu ra chương trình đào tạo cho khoa Cơ khí trường Đại học Công nghệ Đông Á đã được xác nhận và đáp ứng đầy đủ các yêu cầu về tính logic, tính khả dụng và sự tuân thủ các tiêu chuẩn kiểm định chất lượng giáo dục. Nền tảng sẵn sàng để triển khai và sử dụng trong thực tế.
