# Dữ liệu Mẫu cho Nền tảng Đánh giá Chuẩn Đầu ra

## 1. Dữ liệu Chương trình Đào tạo

### 1.1 Chương trình Đào tạo
```json
[
  {
    "id": "ME2025",
    "name": "Kỹ thuật Cơ khí",
    "department": "Khoa Cơ khí",
    "degree": "Kỹ sư",
    "credits": 150,
    "duration": 4.5,
    "description": "Chương trình đào tạo kỹ sư cơ khí với kiến thức và kỹ năng chuyên sâu về thiết kế, chế tạo và vận hành hệ thống cơ khí.",
    "status": "active",
    "version": "2025.1"
  }
]
```

### 1.2 Chuẩn đầu ra Chương trình (PLO)
```json
[
  {
    "id": "PLO1",
    "program_id": "ME2025",
    "code": "PLO1",
    "description": "Áp dụng kiến thức toán học, khoa học và kỹ thuật để giải quyết các vấn đề cơ khí phức tạp.",
    "bloom_level": "Áp dụng",
    "category": "Kiến thức",
    "status": "active"
  },
  {
    "id": "PLO2",
    "program_id": "ME2025",
    "code": "PLO2",
    "description": "Thiết kế và thực hiện thí nghiệm, phân tích và diễn giải dữ liệu để rút ra kết luận hợp lý.",
    "bloom_level": "Phân tích",
    "category": "Kỹ năng",
    "status": "active"
  },
  {
    "id": "PLO3",
    "program_id": "ME2025",
    "code": "PLO3",
    "description": "Thiết kế hệ thống, thành phần hoặc quy trình cơ khí đáp ứng nhu cầu thực tế với các ràng buộc về kinh tế, môi trường, xã hội, chính trị, đạo đức, sức khỏe và an toàn.",
    "bloom_level": "Sáng tạo",
    "category": "Kỹ năng",
    "status": "active"
  },
  {
    "id": "PLO4",
    "program_id": "ME2025",
    "code": "PLO4",
    "description": "Làm việc hiệu quả trong các nhóm đa ngành và đa văn hóa.",
    "bloom_level": "Áp dụng",
    "category": "Kỹ năng mềm",
    "status": "active"
  },
  {
    "id": "PLO5",
    "program_id": "ME2025",
    "code": "PLO5",
    "description": "Xác định, xây dựng và giải quyết các vấn đề kỹ thuật cơ khí.",
    "bloom_level": "Đánh giá",
    "category": "Kỹ năng",
    "status": "active"
  },
  {
    "id": "PLO6",
    "program_id": "ME2025",
    "code": "PLO6",
    "description": "Hiểu biết về trách nhiệm nghề nghiệp và đạo đức.",
    "bloom_level": "Hiểu",
    "category": "Thái độ",
    "status": "active"
  },
  {
    "id": "PLO7",
    "program_id": "ME2025",
    "code": "PLO7",
    "description": "Giao tiếp hiệu quả bằng văn bản, thuyết trình và trong các tình huống đàm phán.",
    "bloom_level": "Áp dụng",
    "category": "Kỹ năng mềm",
    "status": "active"
  },
  {
    "id": "PLO8",
    "program_id": "ME2025",
    "code": "PLO8",
    "description": "Hiểu biết về tác động của các giải pháp kỹ thuật cơ khí trong bối cảnh toàn cầu, kinh tế, môi trường và xã hội.",
    "bloom_level": "Hiểu",
    "category": "Kiến thức",
    "status": "active"
  },
  {
    "id": "PLO9",
    "program_id": "ME2025",
    "code": "PLO9",
    "description": "Nhận thức về nhu cầu học tập suốt đời và khả năng tham gia vào quá trình học tập suốt đời.",
    "bloom_level": "Hiểu",
    "category": "Thái độ",
    "status": "active"
  },
  {
    "id": "PLO10",
    "program_id": "ME2025",
    "code": "PLO10",
    "description": "Sử dụng thành thạo các kỹ thuật, kỹ năng và công cụ kỹ thuật hiện đại cần thiết cho thực hành kỹ thuật cơ khí.",
    "bloom_level": "Áp dụng",
    "category": "Kỹ năng",
    "status": "active"
  }
]
```

### 1.3 Học phần
```json
[
  {
    "id": "ME101",
    "program_id": "ME2025",
    "code": "ME101",
    "name": "Nhập môn Kỹ thuật Cơ khí",
    "credits": 3,
    "description": "Giới thiệu về ngành kỹ thuật cơ khí, các nguyên lý cơ bản và ứng dụng.",
    "prerequisites": [],
    "semester": 1,
    "status": "active"
  },
  {
    "id": "ME201",
    "program_id": "ME2025",
    "code": "ME201",
    "name": "Cơ học Vật rắn",
    "credits": 4,
    "description": "Nghiên cứu về lực, chuyển động và biến dạng của vật rắn.",
    "prerequisites": ["ME101"],
    "semester": 3,
    "status": "active"
  },
  {
    "id": "ME301",
    "program_id": "ME2025",
    "code": "ME301",
    "name": "Thiết kế Máy",
    "credits": 4,
    "description": "Nguyên lý và phương pháp thiết kế các thành phần và hệ thống máy.",
    "prerequisites": ["ME201"],
    "semester": 5,
    "status": "active"
  }
]
```

### 1.4 Chuẩn đầu ra Học phần (CLO)
```json
[
  {
    "id": "CLO1_ME101",
    "course_id": "ME101",
    "code": "CLO1",
    "description": "Mô tả các nguyên lý cơ bản của kỹ thuật cơ khí.",
    "bloom_level": "Hiểu",
    "category": "Kiến thức",
    "status": "active"
  },
  {
    "id": "CLO2_ME101",
    "course_id": "ME101",
    "code": "CLO2",
    "description": "Xác định các thành phần cơ bản của hệ thống cơ khí.",
    "bloom_level": "Hiểu",
    "category": "Kiến thức",
    "status": "active"
  },
  {
    "id": "CLO3_ME101",
    "course_id": "ME101",
    "code": "CLO3",
    "description": "Sử dụng các công cụ cơ bản trong kỹ thuật cơ khí.",
    "bloom_level": "Áp dụng",
    "category": "Kỹ năng",
    "status": "active"
  },
  {
    "id": "CLO1_ME201",
    "course_id": "ME201",
    "code": "CLO1",
    "description": "Phân tích trạng thái ứng suất và biến dạng của vật rắn.",
    "bloom_level": "Phân tích",
    "category": "Kỹ năng",
    "status": "active"
  },
  {
    "id": "CLO2_ME201",
    "course_id": "ME201",
    "code": "CLO2",
    "description": "Áp dụng các nguyên lý cơ học để giải quyết các bài toán kỹ thuật.",
    "bloom_level": "Áp dụng",
    "category": "Kỹ năng",
    "status": "active"
  },
  {
    "id": "CLO3_ME201",
    "course_id": "ME201",
    "code": "CLO3",
    "description": "Thực hiện các thí nghiệm cơ học và phân tích kết quả.",
    "bloom_level": "Phân tích",
    "category": "Kỹ năng",
    "status": "active"
  },
  {
    "id": "CLO1_ME301",
    "course_id": "ME301",
    "code": "CLO1",
    "description": "Thiết kế các thành phần cơ khí đáp ứng các yêu cầu kỹ thuật.",
    "bloom_level": "Sáng tạo",
    "category": "Kỹ năng",
    "status": "active"
  },
  {
    "id": "CLO2_ME301",
    "course_id": "ME301",
    "code": "CLO2",
    "description": "Sử dụng phần mềm CAD để thiết kế và mô phỏng các thành phần cơ khí.",
    "bloom_level": "Áp dụng",
    "category": "Kỹ năng",
    "status": "active"
  },
  {
    "id": "CLO3_ME301",
    "course_id": "ME301",
    "code": "CLO3",
    "description": "Đánh giá hiệu quả của các thiết kế cơ khí dựa trên các tiêu chí kỹ thuật và kinh tế.",
    "bloom_level": "Đánh giá",
    "category": "Kỹ năng",
    "status": "active"
  }
]
```

### 1.5 Ma trận CLO-PLO
```json
[
  {
    "id": "MAP1",
    "course_id": "ME101",
    "clo_id": "CLO1_ME101",
    "plo_id": "PLO1",
    "contribution_level": "medium"
  },
  {
    "id": "MAP2",
    "course_id": "ME101",
    "clo_id": "CLO2_ME101",
    "plo_id": "PLO1",
    "contribution_level": "medium"
  },
  {
    "id": "MAP3",
    "course_id": "ME101",
    "clo_id": "CLO3_ME101",
    "plo_id": "PLO10",
    "contribution_level": "high"
  },
  {
    "id": "MAP4",
    "course_id": "ME201",
    "clo_id": "CLO1_ME201",
    "plo_id": "PLO1",
    "contribution_level": "high"
  },
  {
    "id": "MAP5",
    "course_id": "ME201",
    "clo_id": "CLO1_ME201",
    "plo_id": "PLO5",
    "contribution_level": "medium"
  },
  {
    "id": "MAP6",
    "course_id": "ME201",
    "clo_id": "CLO2_ME201",
    "plo_id": "PLO1",
    "contribution_level": "high"
  },
  {
    "id": "MAP7",
    "course_id": "ME201",
    "clo_id": "CLO3_ME201",
    "plo_id": "PLO2",
    "contribution_level": "high"
  },
  {
    "id": "MAP8",
    "course_id": "ME301",
    "clo_id": "CLO1_ME301",
    "plo_id": "PLO3",
    "contribution_level": "high"
  },
  {
    "id": "MAP9",
    "course_id": "ME301",
    "clo_id": "CLO2_ME301",
    "plo_id": "PLO10",
    "contribution_level": "high"
  },
  {
    "id": "MAP10",
    "course_id": "ME301",
    "clo_id": "CLO3_ME301",
    "plo_id": "PLO5",
    "contribution_level": "high"
  }
]
```

## 2. Dữ liệu Đánh giá

### 2.1 Nhóm Đánh giá
```json
[
  {
    "id": "AG1_ME101",
    "course_id": "ME101",
    "name": "Kiểm tra giữa kỳ",
    "weight": 0.3,
    "description": "Bài kiểm tra giữa kỳ đánh giá kiến thức cơ bản.",
    "status": "active"
  },
  {
    "id": "AG2_ME101",
    "course_id": "ME101",
    "name": "Bài tập lớn",
    "weight": 0.2,
    "description": "Bài tập lớn về ứng dụng kỹ thuật cơ khí.",
    "status": "active"
  },
  {
    "id": "AG3_ME101",
    "course_id": "ME101",
    "name": "Thi cuối kỳ",
    "weight": 0.5,
    "description": "Bài thi cuối kỳ đánh giá toàn bộ kiến thức và kỹ năng.",
    "status": "active"
  },
  {
    "id": "AG1_ME201",
    "course_id": "ME201",
    "name": "Kiểm tra giữa kỳ",
    "weight": 0.25,
    "description": "Bài kiểm tra giữa kỳ đánh giá kiến thức cơ bản.",
    "status": "active"
  },
  {
    "id": "AG2_ME201",
    "course_id": "ME201",
    "name": "Thí nghiệm",
    "weight": 0.25,
    "description": "Báo cáo thí nghiệm cơ học vật rắn.",
    "status": "active"
  },
  {
    "id": "AG3_ME201",
    "course_id": "ME201",
    "name": "Thi cuối kỳ",
    "weight": 0.5,
    "description": "Bài thi cuối kỳ đánh giá toàn bộ kiến thức và kỹ năng.",
    "status": "active"
  },
  {
    "id": "AG1_ME301",
    "course_id": "ME301",
    "name": "Kiểm tra giữa kỳ",
    "weight": 0.2,
    "description": "Bài kiểm tra giữa kỳ đánh giá kiến thức cơ bản.",
    "status": "active"
  },
  {
    "id": "AG2_ME301",
    "course_id": "ME301",
    "name": "Đồ án thiết kế",
    "weight": 0.3,
    "description": "Đồ án thiết kế một hệ thống cơ khí.",
    "status": "active"
  },
  {
    "id": "AG3_ME301",
    "course_id": "ME301",
    "name": "Thi cuối kỳ",
    "weight": 0.5,
    "description": "Bài thi cuối kỳ đánh giá toàn bộ kiến thức và kỹ năng.",
    "status": "active"
  }
]
```

### 2.2 Câu hỏi/Tiêu chí
```json
[
  {
    "id": "Q1_AG1_ME101",
    "assessment_group_id": "AG1_ME101",
    "code": "Q1",
    "description": "Trình bày các nguyên lý cơ bản của kỹ thuật cơ khí.",
    "max_score": 10,
    "weight": 0.5,
    "type": "essay"
  },
  {
    "id": "Q2_AG1_ME101",
    "assessment_group_id": "AG1_ME101",
    "code": "Q2",
    "description": "Mô tả các thành phần cơ bản của một hệ thống cơ khí.",
    "max_score": 10,
    "weight": 0.5,
    "type": "essay"
  },
  {
    "id": "Q1_AG3_ME101",
    "assessment_group_id": "AG3_ME101",
    "code": "Q1",
    "description": "Phân tích ưu nhược điểm của các loại vật liệu cơ khí.",
    "max_score": 10,
    "weight": 0.3,
    "type": "essay"
  },
  {
    "id": "Q2_AG3_ME101",
    "assessment_group_id": "AG3_ME101",
    "code": "Q2",
    "description": "Giải thích nguyên lý hoạt động của một hệ thống cơ khí cụ thể.",
    "max_score": 10,
    "weight": 0.3,
    "type": "essay"
  },
  {
    "id": "Q3_AG3_ME101",
    "assessment_group_id": "AG3_ME101",
    "code": "Q3",
    "description": "Áp dụng kiến thức để giải quyết một vấn đề cơ khí đơn giản.",
    "max_score": 10,
    "weight": 0.4,
    "type": "problem"
  },
  {
    "id": "Q1_AG1_ME201",
    "assessment_group_id": "AG1_ME201",
    "code": "Q1",
    "description": "Phân tích trạng thái ứng suất của một vật thể chịu lực.",
    "max_score": 10,
    "weight": 0.5,
    "type": "problem"
  },
  {
    "id": "Q2_AG1_ME201",
    "assessment_group_id": "AG1_ME201",
    "code": "Q2",
    "description": "Tính toán biến dạng của một kết cấu đơn giản.",
    "max_score": 10,
    "weight": 0.5,
    "type": "problem"
  },
  {
    "id": "Q1_AG2_ME201",
    "assessment_group_id": "AG2_ME201",
    "code": "Q1",
    "description": "Thực hiện thí nghiệm đo ứng suất và biến dạng.",
    "max_score": 10,
    "weight": 0.5,
    "type": "practical"
  },
  {
    "id": "Q2_AG2_ME201",
    "assessment_group_id": "AG2_ME201",
    "code": "Q2",
    "description": "Phân tích và diễn giải kết quả thí nghiệm.",
    "max_score": 10,
    "weight": 0.5,
    "type": "report"
  },
  {
    "id": "Q1_AG1_ME301",
    "assessment_group_id": "AG1_ME301",
    "code": "Q1",
    "description": "Phân tích yêu cầu kỹ thuật của một hệ thống cơ khí.",
    "max_score": 10,
    "weight": 0.5,
    "type": "essay"
  },
  {
    "id": "Q2_AG1_ME301",
    "assessment_group_id": "AG1_ME301",
    "code": "Q2",
    "description": "Đánh giá hiệu quả của một thiết kế cơ khí.",
    "max_score": 10,
    "weight": 0.5,
    "type": "essay"
  },
  {
    "id": "Q1_AG2_ME301",
    "assessment_group_id": "AG2_ME301",
    "code": "Q1",
    "description": "Thiết kế một hệ thống cơ khí đáp ứng yêu cầu kỹ thuật.",
    "max_score": 10,
    "weight": 0.6,
    "type": "project"
  },
  {
    "id": "Q2_AG2_ME301",
    "assessment_group_id": "AG2_ME301",
    "code": "Q2",
    "description": "Thuyết trình và bảo vệ thiết kế.",
    "max_score": 10,
    "weight": 0.4,
    "type": "presentation"
  }
]
```

### 2.3 Ma trận Câu hỏi-CLO
```json
[
  {
    "id": "QC1",
    "question_id": "Q1_AG1_ME101",
    "clo_id": "CLO1_ME101",
    "contribution_level": "high"
  },
  {
    "id": "QC2",
    "question_id": "Q2_AG1_ME101",
    "clo_id": "CLO2_ME101",
    "contribution_level": "high"
  },
  {
    "id": "QC3",
    "question_id": "Q1_AG3_ME101",
    "clo_id": "CLO1_ME101",
    "contribution_level": "medium"
  },
  {
    "id": "QC4",
    "question_id": "Q2_AG3_ME101",
    "clo_id": "CLO2_ME101",
    "contribution_level": "high"
  },
  {
    "id": "QC5",
    "question_id": "Q3_AG3_ME101",
    "clo_id": "CLO3_ME101",
    "contribution_level": "high"
  },
  {
    "id": "QC6",
    "question_id": "Q1_AG1_ME201",
    "clo_id": "CLO1_ME201",
    "contribution_level": "high"
  },
  {
    "id": "QC7",
    "question_id": "Q2_AG1_ME201",
    "clo_id": "CLO2_ME201",
    "contribution_level": "high"
  },
  {
    "id": "QC8",
    "question_id": "Q1_AG2_ME201",
    "clo_id": "CLO3_ME201",
    "contribution_level": "high"
  },
  {
    "id": "QC9",
    "question_id": "Q2_AG2_ME201",
    "clo_id": "CLO3_ME201",
    "contribution_level": "high"
  },
  {
    "id": "QC10",
    "question_id": "Q1_AG1_ME301",
    "clo_id": "CLO1_ME301",
    "contribution_level": "medium"
  },
  {
    "id": "QC11",
    "question_id": "Q2_AG1_ME301",
    "clo_id": "CLO3_ME301",
    "contribution_level": "high"
  },
  {
    "id": "QC12",
    "question_id": "Q1_AG2_ME301",
    "clo_id": "CLO1_ME301",
    "contribution_level": "high"
  },
  {
    "id": "QC13",
    "question_id": "Q2_AG2_ME301",
    "clo_id": "CLO3_ME301",
    "contribution_level": "medium"
  }
]
```

### 2.4 Rubric
```json
[
  {
    "id": "R1_Q1_AG2_ME301",
    "question_id": "Q1_AG2_ME301",
    "name": "Rubric đánh giá đồ án thiết kế",
    "description": "Tiêu chí đánh giá đồ án thiết kế hệ thống cơ khí.",
    "criteria": [
      {
        "name": "Phân tích yêu cầu",
        "weight": 0.2,
        "levels": [
          {
            "score": 0,
            "description": "Không phân tích được yêu cầu."
          },
          {
            "score": 5,
            "description": "Phân tích được một phần yêu cầu."
          },
          {
            "score": 10,
            "description": "Phân tích đầy đủ và chính xác yêu cầu."
          }
        ]
      },
      {
        "name": "Thiết kế kỹ thuật",
        "weight": 0.4,
        "levels": [
          {
            "score": 0,
            "description": "Thiết kế không đáp ứng yêu cầu."
          },
          {
            "score": 5,
            "description": "Thiết kế đáp ứng một phần yêu cầu."
          },
          {
            "score": 10,
            "description": "Thiết kế đáp ứng đầy đủ yêu cầu và có tính sáng tạo."
          }
        ]
      },
      {
        "name": "Tính toán kỹ thuật",
        "weight": 0.3,
        "levels": [
          {
            "score": 0,
            "description": "Không có tính toán hoặc tính toán sai."
          },
          {
            "score": 5,
            "description": "Tính toán cơ bản, còn một số lỗi."
          },
          {
            "score": 10,
            "description": "Tính toán đầy đủ, chính xác và chi tiết."
          }
        ]
      },
      {
        "name": "Trình bày",
        "weight": 0.1,
        "levels": [
          {
            "score": 0,
            "description": "Trình bày không rõ ràng, thiếu chuyên nghiệp."
          },
          {
            "score": 5,
            "description": "Trình bày tương đối rõ ràng."
          },
          {
            "score": 10,
            "description": "Trình bày rõ ràng, chuyên nghiệp và đầy đủ."
          }
        ]
      }
    ]
  },
  {
    "id": "R1_Q2_AG2_ME301",
    "question_id": "Q2_AG2_ME301",
    "name": "Rubric đánh giá thuyết trình",
    "description": "Tiêu chí đánh giá thuyết trình và bảo vệ đồ án.",
    "criteria": [
      {
        "name": "Nội dung",
        "weight": 0.4,
        "levels": [
          {
            "score": 0,
            "description": "Nội dung không đầy đủ, thiếu chính xác."
          },
          {
            "score": 5,
            "description": "Nội dung tương đối đầy đủ, còn một số thiếu sót."
          },
          {
            "score": 10,
            "description": "Nội dung đầy đủ, chính xác và phù hợp."
          }
        ]
      },
      {
        "name": "Kỹ năng thuyết trình",
        "weight": 0.3,
        "levels": [
          {
            "score": 0,
            "description": "Thuyết trình không rõ ràng, thiếu tự tin."
          },
          {
            "score": 5,
            "description": "Thuyết trình tương đối rõ ràng, còn lúng túng."
          },
          {
            "score": 10,
            "description": "Thuyết trình rõ ràng, tự tin và thuyết phục."
          }
        ]
      },
      {
        "name": "Trả lời câu hỏi",
        "weight": 0.3,
        "levels": [
          {
            "score": 0,
            "description": "Không trả lời được câu hỏi."
          },
          {
            "score": 5,
            "description": "Trả lời được một phần câu hỏi."
          },
          {
            "score": 10,
            "description": "Trả lời đầy đủ và chính xác câu hỏi."
          }
        ]
      }
    ]
  }
]
```

### 2.5 Điểm số
```json
[
  {
    "id": "S1",
    "student_id": "SV001",
    "question_id": "Q1_AG1_ME101",
    "score": 8.5
  },
  {
    "id": "S2",
    "student_id": "SV001",
    "question_id": "Q2_AG1_ME101",
    "score": 7.5
  },
  {
    "id": "S3",
    "student_id": "SV001",
    "question_id": "Q1_AG3_ME101",
    "score": 9.0
  },
  {
    "id": "S4",
    "student_id": "SV001",
    "question_id": "Q2_AG3_ME101",
    "score": 8.0
  },
  {
    "id": "S5",
    "student_id": "SV001",
    "question_id": "Q3_AG3_ME101",
    "score": 7.0
  },
  {
    "id": "S6",
    "student_id": "SV002",
    "question_id": "Q1_AG1_ME101",
    "score": 6.5
  },
  {
    "id": "S7",
    "student_id": "SV002",
    "question_id": "Q2_AG1_ME101",
    "score": 7.0
  },
  {
    "id": "S8",
    "student_id": "SV002",
    "question_id": "Q1_AG3_ME101",
    "score": 8.0
  },
  {
    "id": "S9",
    "student_id": "SV002",
    "question_id": "Q2_AG3_ME101",
    "score": 7.5
  },
  {
    "id": "S10",
    "student_id": "SV002",
    "question_id": "Q3_AG3_ME101",
    "score": 6.0
  }
]
```

## 3. Dữ liệu Người dùng

### 3.1 Người dùng
```json
[
  {
    "id": "U001",
    "username": "admin",
    "email": "admin@eaut.edu.vn",
    "full_name": "Quản trị viên",
    "role_id": "R001",
    "department_id": null,
    "status": "active"
  },
  {
    "id": "U002",
    "username": "quality_admin",
    "email": "quality@eaut.edu.vn",
    "full_name": "Quản trị viên Chất lượng",
    "role_id": "R002",
    "department_id": null,
    "status": "active"
  },
  {
    "id": "U003",
    "username": "dept_chair",
    "email": "chair@eaut.edu.vn",
    "full_name": "Trưởng Khoa Cơ khí",
    "role_id": "R003",
    "department_id": "D001",
    "status": "active"
  },
  {
    "id": "U004",
    "username": "lecturer1",
    "email": "lecturer1@eaut.edu.vn",
    "full_name": "Giảng viên 1",
    "role_id": "R004",
    "department_id": "D001",
    "status": "active"
  },
  {
    "id": "U005",
    "username": "lecturer2",
    "email": "lecturer2@eaut.edu.vn",
    "full_name": "Giảng viên 2",
    "role_id": "R004",
    "department_id": "D001",
    "status": "active"
  },
  {
    "id": "U006",
    "username": "student1",
    "email": "student1@eaut.edu.vn",
    "full_name": "Sinh viên 1",
    "role_id": "R005",
    "department_id": "D001",
    "status": "active"
  },
  {
    "id": "U007",
    "username": "student2",
    "email": "student2@eaut.edu.vn",
    "full_name": "Sinh viên 2",
    "role_id": "R005",
    "department_id": "D001",
    "status": "active"
  },
  {
    "id": "U008",
    "username": "leadership",
    "email": "leadership@eaut.edu.vn",
    "full_name": "Lãnh đạo",
    "role_id": "R006",
    "department_id": null,
    "status": "active"
  }
]
```

### 3.2 Vai trò
```json
[
  {
    "id": "R001",
    "name": "System Administrator",
    "description": "Quản trị viên hệ thống",
    "status": "active"
  },
  {
    "id": "R002",
    "name": "Quality Administrator",
    "description": "Quản trị viên chất lượng",
    "status": "active"
  },
  {
    "id": "R003",
    "name": "Department Chair",
    "description": "Trưởng Khoa/Bộ môn",
    "status": "active"
  },
  {
    "id": "R004",
    "name": "Lecturer",
    "description": "Giảng viên",
    "status": "active"
  },
  {
    "id": "R005",
    "name": "Student",
    "description": "Sinh viên",
    "status": "active"
  },
  {
    "id": "R006",
    "name": "Leadership",
    "description": "Lãnh đạo",
    "status": "active"
  }
]
```

### 3.3 Khoa/Bộ môn
```json
[
  {
    "id": "D001",
    "name": "Khoa Cơ khí",
    "description": "Khoa Cơ khí - Trường Đại học Công nghệ Đông Á",
    "head_id": "U003",
    "status": "active"
  }
]
```

### 3.4 Lớp học
```json
[
  {
    "id": "C001",
    "course_id": "ME101",
    "name": "ME101-01",
    "semester": "2025-1",
    "lecturer_id": "U004",
    "status": "active"
  },
  {
    "id": "C002",
    "course_id": "ME201",
    "name": "ME201-01",
    "semester": "2025-1",
    "lecturer_id": "U005",
    "status": "active"
  },
  {
    "id": "C003",
    "course_id": "ME301",
    "name": "ME301-01",
    "semester": "2025-1",
    "lecturer_id": "U004",
    "status": "active"
  }
]
```

## 4. Dữ liệu Báo cáo

### 4.1 Báo cáo CLO
```json
[
  {
    "id": "CR001",
    "course_id": "ME101",
    "class_id": "C001",
    "semester": "2025-1",
    "report_date": "2025-06-30",
    "clo_results": [
      {
        "clo_id": "CLO1_ME101",
        "total_students": 30,
        "passed_students": 25,
        "pass_rate": 0.83,
        "average_score": 7.8
      },
      {
        "clo_id": "CLO2_ME101",
        "total_students": 30,
        "passed_students": 22,
        "pass_rate": 0.73,
        "average_score": 7.2
      },
      {
        "clo_id": "CLO3_ME101",
        "total_students": 30,
        "passed_students": 28,
        "pass_rate": 0.93,
        "average_score": 8.1
      }
    ]
  }
]
```

### 4.2 Báo cáo PLO
```json
[
  {
    "id": "PR001",
    "program_id": "ME2025",
    "cohort": "2025",
    "academic_year": "2025-2026",
    "report_date": "2026-06-30",
    "plo_results": [
      {
        "plo_id": "PLO1",
        "total_students": 150,
        "passed_students": 120,
        "pass_rate": 0.8,
        "average_score": 7.5
      },
      {
        "plo_id": "PLO2",
        "total_students": 150,
        "passed_students": 135,
        "pass_rate": 0.9,
        "average_score": 8.0
      },
      {
        "plo_id": "PLO3",
        "total_students": 150,
        "passed_students": 125,
        "pass_rate": 0.83,
        "average_score": 7.7
      }
    ]
  }
]
```

### 4.3 Báo cáo Xu hướng
```json
[
  {
    "id": "TR001",
    "program_id": "ME2025",
    "report_date": "2026-06-30",
    "trend_data": [
      {
        "academic_year": "2023-2024",
        "plo_results": [
          {
            "plo_id": "PLO1",
            "pass_rate": 0.75
          },
          {
            "plo_id": "PLO2",
            "pass_rate": 0.85
          },
          {
            "plo_id": "PLO3",
            "pass_rate": 0.78
          }
        ]
      },
      {
        "academic_year": "2024-2025",
        "plo_results": [
          {
            "plo_id": "PLO1",
            "pass_rate": 0.78
          },
          {
            "plo_id": "PLO2",
            "pass_rate": 0.87
          },
          {
            "plo_id": "PLO3",
            "pass_rate": 0.8
          }
        ]
      },
      {
        "academic_year": "2025-2026",
        "plo_results": [
          {
            "plo_id": "PLO1",
            "pass_rate": 0.8
          },
          {
            "plo_id": "PLO2",
            "pass_rate": 0.9
          },
          {
            "plo_id": "PLO3",
            "pass_rate": 0.83
          }
        ]
      }
    ]
  }
]
```

### 4.4 Báo cáo So sánh
```json
[
  {
    "id": "CP001",
    "report_date": "2026-06-30",
    "comparison_data": [
      {
        "department_id": "D001",
        "department_name": "Khoa Cơ khí",
        "plo_results": [
          {
            "plo_id": "PLO1",
            "pass_rate": 0.8
          },
          {
            "plo_id": "PLO2",
            "pass_rate": 0.9
          },
          {
            "plo_id": "PLO3",
            "pass_rate": 0.83
          }
        ]
      },
      {
        "department_id": "D002",
        "department_name": "Khoa Điện - Điện tử",
        "plo_results": [
          {
            "plo_id": "PLO1",
            "pass_rate": 0.82
          },
          {
            "plo_id": "PLO2",
            "pass_rate": 0.88
          },
          {
            "plo_id": "PLO3",
            "pass_rate": 0.85
          }
        ]
      }
    ]
  }
]
```
