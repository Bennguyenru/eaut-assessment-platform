// main.js - Main JavaScript file for EAUT Assessment Platform

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
    
    // Add event listeners
    addEventListeners();
    
    // Initialize charts
    initCharts();
});

// Initialize the application
function initApp() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
        // Show main app and hide login page
        document.getElementById('login-page').classList.add('d-none');
        document.getElementById('main-app').classList.remove('d-none');
        
        // Set user info
        const user = JSON.parse(localStorage.getItem('user'));
        document.getElementById('user-fullname').textContent = user.fullName;
        
        // Load dashboard data
        loadDashboardData();
    } else {
        // Show login page and hide main app
        document.getElementById('login-page').classList.remove('d-none');
        document.getElementById('main-app').classList.add('d-none');
    }
}

// Add event listeners
function addEventListeners() {
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            login();
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            navigateTo(target);
        });
    });
    
    // Save PLO button
    const savePloBtn = document.getElementById('save-plo-btn');
    if (savePloBtn) {
        savePloBtn.addEventListener('click', function() {
            savePlo();
        });
    }
    
    // Save CLO button
    const saveCloBtn = document.getElementById('save-clo-btn');
    if (saveCloBtn) {
        saveCloBtn.addEventListener('click', function() {
            saveClo();
        });
    }
    
    // Generate CLO Report button
    const generateCloReportBtn = document.getElementById('generate-clo-report-btn');
    if (generateCloReportBtn) {
        generateCloReportBtn.addEventListener('click', function() {
            generateCloReport();
        });
    }
    
    // Course filter change for CLO table
    const courseFilter = document.getElementById('course-filter');
    if (courseFilter) {
        courseFilter.addEventListener('change', function() {
            loadClos(this.value);
        });
    }
    
    // Course filter change for CLO-PLO matrix
    const matrixCourseFilter = document.getElementById('matrix-course-filter');
    if (matrixCourseFilter) {
        matrixCourseFilter.addEventListener('change', function() {
            loadCloPloMatrix(this.value);
        });
    }
    
    // Course filter change for CLO report
    const cloReportCourseFilter = document.getElementById('clo-report-course-filter');
    if (cloReportCourseFilter) {
        cloReportCourseFilter.addEventListener('change', function() {
            loadClassesForCourse(this.value, 'clo-report-class-filter');
        });
    }
    
    // Class filter change for CLO report
    const cloReportClassFilter = document.getElementById('clo-report-class-filter');
    if (cloReportClassFilter) {
        cloReportClassFilter.addEventListener('change', function() {
            loadCloReport();
        });
    }
}

// Login function
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showNotification('Vui lòng nhập đầy đủ thông tin đăng nhập', 'error');
        return;
    }
    
    try {
        // Show loading state
        const loginBtn = document.querySelector('#login-form button[type="submit"]');
        const originalText = loginBtn.textContent;
        loginBtn.textContent = 'Đang đăng nhập...';
        loginBtn.disabled = true;
        
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Store user info and token in localStorage
            localStorage.setItem('user', JSON.stringify(result.data));
            localStorage.setItem('token', result.data.token);
            
            // Show main app and hide login page
            document.getElementById('login-page').classList.add('d-none');
            document.getElementById('main-app').classList.remove('d-none');
            
            // Set user info
            document.getElementById('user-fullname').textContent = result.data.fullName;
            
            // Load dashboard data
            await loadDashboardData();
            
            showNotification('Đăng nhập thành công!', 'success');
        } else {
            showNotification(result.error || 'Đăng nhập thất bại', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Lỗi kết nối. Vui lòng thử lại.', 'error');
    } finally {
        // Reset button state
        const loginBtn = document.querySelector('#login-form button[type="submit"]');
        loginBtn.textContent = 'Đăng nhập';
        loginBtn.disabled = false;
    }
}

// Logout function
function logout() {
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Show login page and hide main app
    document.getElementById('login-page').classList.remove('d-none');
    document.getElementById('main-app').classList.add('d-none');
}

// Navigate to a page
function navigateTo(target) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.add('d-none');
    });
    
    // Show the target page
    const targetPage = document.getElementById(target + '-page');
    if (targetPage) {
        targetPage.classList.remove('d-none');
        
        // Load page-specific data
        switch (target) {
            case 'dashboard':
                loadDashboardData();
                break;
            case 'introduction':
                // Introduction page doesn't need dynamic data loading
                break;
            case 'plo-management':
                loadPlos();
                break;
            case 'clo-management':
                loadClos(document.getElementById('course-filter').value);
                break;
            case 'clo-plo-matrix':
                loadCloPloMatrix(document.getElementById('matrix-course-filter').value);
                break;
            case 'clo-reports':
                loadCloReport();
                break;
        }
    } else {
        // Default to dashboard if target page doesn't exist
        document.getElementById('dashboard-page').classList.remove('d-none');
        loadDashboardData();
    }
}

// Load dashboard data
function loadDashboardData() {
    // Simulate API calls to get counts
    // In a real application, these would be actual API calls
    document.getElementById('program-count').textContent = '1';
    document.getElementById('course-count').textContent = '3';
    document.getElementById('class-count').textContent = '3';
    document.getElementById('student-count').textContent = '150';
    
    // Update charts
    updatePloChart();
    updateCloChart();
}

// Load PLOs
function loadPlos() {
    // Simulate API call to get PLOs
    // In a real application, this would be an actual API call
    const plos = [
        {
            id: 'PLO1',
            code: 'PLO1',
            description: 'Áp dụng kiến thức toán học, khoa học và kỹ thuật để giải quyết các vấn đề cơ khí phức tạp.',
            bloom_level: 'Áp dụng',
            category: 'Kiến thức',
            status: 'active'
        },
        {
            id: 'PLO2',
            code: 'PLO2',
            description: 'Thiết kế và thực hiện thí nghiệm, phân tích và diễn giải dữ liệu để rút ra kết luận hợp lý.',
            bloom_level: 'Phân tích',
            category: 'Kỹ năng',
            status: 'active'
        },
        {
            id: 'PLO3',
            code: 'PLO3',
            description: 'Thiết kế hệ thống, thành phần hoặc quy trình cơ khí đáp ứng nhu cầu thực tế với các ràng buộc về kinh tế, môi trường, xã hội, chính trị, đạo đức, sức khỏe và an toàn.',
            bloom_level: 'Sáng tạo',
            category: 'Kỹ năng',
            status: 'active'
        }
    ];
    
    // Update PLO table
    const ploTable = document.getElementById('plo-table');
    if (ploTable) {
        ploTable.innerHTML = '';
        
        plos.forEach(plo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${plo.code}</td>
                <td>${plo.description}</td>
                <td>${plo.bloom_level}</td>
                <td>${plo.category}</td>
                <td><span class="badge bg-${plo.status === 'active' ? 'success' : 'danger'}">${plo.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary edit-plo-btn" data-id="${plo.id}"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-danger delete-plo-btn" data-id="${plo.id}"><i class="bi bi-trash"></i></button>
                </td>
            `;
            ploTable.appendChild(row);
        });
        
        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-plo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const ploId = this.getAttribute('data-id');
                editPlo(ploId);
            });
        });
        
        document.querySelectorAll('.delete-plo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const ploId = this.getAttribute('data-id');
                deletePlo(ploId);
            });
        });
    }
}

// Load CLOs
function loadClos(courseId) {
    // Simulate API call to get CLOs
    // In a real application, this would be an actual API call
    let clos = [];
    
    if (courseId === 'ME101') {
        clos = [
            {
                id: 'CLO1_ME101',
                code: 'CLO1',
                description: 'Mô tả các nguyên lý cơ bản của kỹ thuật cơ khí.',
                bloom_level: 'Hiểu',
                category: 'Kiến thức',
                status: 'active'
            },
            {
                id: 'CLO2_ME101',
                code: 'CLO2',
                description: 'Xác định các thành phần cơ bản của hệ thống cơ khí.',
                bloom_level: 'Hiểu',
                category: 'Kiến thức',
                status: 'active'
            },
            {
                id: 'CLO3_ME101',
                code: 'CLO3',
                description: 'Sử dụng các công cụ cơ bản trong kỹ thuật cơ khí.',
                bloom_level: 'Áp dụng',
                category: 'Kỹ năng',
                status: 'active'
            }
        ];
    } else if (courseId === 'ME201') {
        clos = [
            {
                id: 'CLO1_ME201',
                code: 'CLO1',
                description: 'Phân tích trạng thái ứng suất và biến dạng của vật rắn.',
                bloom_level: 'Phân tích',
                category: 'Kỹ năng',
                status: 'active'
            },
            {
                id: 'CLO2_ME201',
                code: 'CLO2',
                description: 'Áp dụng các nguyên lý cơ học để giải quyết các bài toán kỹ thuật.',
                bloom_level: 'Áp dụng',
                category: 'Kỹ năng',
                status: 'active'
            },
            {
                id: 'CLO3_ME201',
                code: 'CLO3',
                description: 'Thực hiện các thí nghiệm cơ học và phân tích kết quả.',
                bloom_level: 'Phân tích',
                category: 'Kỹ năng',
                status: 'active'
            }
        ];
    } else if (courseId === 'ME301') {
        clos = [
            {
                id: 'CLO1_ME301',
                code: 'CLO1',
                description: 'Thiết kế các thành phần cơ khí đáp ứng các yêu cầu kỹ thuật.',
                bloom_level: 'Sáng tạo',
                category: 'Kỹ năng',
                status: 'active'
            },
            {
                id: 'CLO2_ME301',
                code: 'CLO2',
                description: 'Sử dụng phần mềm CAD để thiết kế và mô phỏng các thành phần cơ khí.',
                bloom_level: 'Áp dụng',
                category: 'Kỹ năng',
                status: 'active'
            },
            {
                id: 'CLO3_ME301',
                code: 'CLO3',
                description: 'Đánh giá hiệu quả của các thiết kế cơ khí dựa trên các tiêu chí kỹ thuật và kinh tế.',
                bloom_level: 'Đánh giá',
                category: 'Kỹ năng',
                status: 'active'
            }
        ];
    }
    
    // Update CLO table
    const cloTable = document.getElementById('clo-table');
    if (cloTable) {
        cloTable.innerHTML = '';
        
        clos.forEach(clo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${clo.code}</td>
                <td>${clo.description}</td>
                <td>${clo.bloom_level}</td>
                <td>${clo.category}</td>
                <td><span class="badge bg-${clo.status === 'active' ? 'success' : 'danger'}">${clo.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary edit-clo-btn" data-id="${clo.id}"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-danger delete-clo-btn" data-id="${clo.id}"><i class="bi bi-trash"></i></button>
                </td>
            `;
            cloTable.appendChild(row);
        });
        
        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-clo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const cloId = this.getAttribute('data-id');
                editClo(cloId);
            });
        });
        
        document.querySelectorAll('.delete-clo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const cloId = this.getAttribute('data-id');
                deleteClo(cloId);
            });
        });
    }
}

// Load CLO-PLO Matrix
function loadCloPloMatrix(courseId) {
    // Simulate API call to get CLO-PLO matrix
    // In a real application, this would be an actual API call
    let matrix = [];
    
    if (courseId === 'ME101') {
        matrix = [
            { clo_id: 'CLO1_ME101', clo_code: 'CLO1', plo_id: 'PLO1', contribution_level: 'medium' },
            { clo_id: 'CLO2_ME101', clo_code: 'CLO2', plo_id: 'PLO1', contribution_level: 'medium' },
            { clo_id: 'CLO3_ME101', clo_code: 'CLO3', plo_id: 'PLO10', contribution_level: 'high' }
        ];
    } else if (courseId === 'ME201') {
        matrix = [
            { clo_id: 'CLO1_ME201', clo_code: 'CLO1', plo_id: 'PLO1', contribution_level: 'high' },
            { clo_id: 'CLO1_ME201', clo_code: 'CLO1', plo_id: 'PLO5', contribution_level: 'medium' },
            { clo_id: 'CLO2_ME201', clo_code: 'CLO2', plo_id: 'PLO1', contribution_level: 'high' },
            { clo_id: 'CLO3_ME201', clo_code: 'CLO3', plo_id: 'PLO2', contribution_level: 'high' }
        ];
    } else if (courseId === 'ME301') {
        matrix = [
            { clo_id: 'CLO1_ME301', clo_code: 'CLO1', plo_id: 'PLO3', contribution_level: 'high' },
            { clo_id: 'CLO2_ME301', clo_code: 'CLO2', plo_id: 'PLO10', contribution_level: 'high' },
            { clo_id: 'CLO3_ME301', clo_code: 'CLO3', plo_id: 'PLO5', contribution_level: 'high' }
        ];
    }
    
    // Get CLOs for the course
    let clos = [];
    if (courseId === 'ME101') {
        clos = [
            { id: 'CLO1_ME101', code: 'CLO1' },
            { id: 'CLO2_ME101', code: 'CLO2' },
            { id: 'CLO3_ME101', code: 'CLO3' }
        ];
    } else if (courseId === 'ME201') {
        clos = [
            { id: 'CLO1_ME201', code: 'CLO1' },
            { id: 'CLO2_ME201', code: 'CLO2' },
            { id: 'CLO3_ME201', code: 'CLO3' }
        ];
    } else if (courseId === 'ME301') {
        clos = [
            { id: 'CLO1_ME301', code: 'CLO1' },
            { id: 'CLO2_ME301', code: 'CLO2' },
            { id: 'CLO3_ME301', code: 'CLO3' }
        ];
    }
    
    // Get all PLOs
    const plos = [
        { id: 'PLO1', code: 'PLO1' },
        { id: 'PLO2', code: 'PLO2' },
        { id: 'PLO3', code: 'PLO3' },
        { id: 'PLO4', code: 'PLO4' },
        { id: 'PLO5', code: 'PLO5' },
        { id: 'PLO6', code: 'PLO6' },
        { id: 'PLO7', code: 'PLO7' },
        { id: 'PLO8', code: 'PLO8' },
        { id: 'PLO9', code: 'PLO9' },
        { id: 'PLO10', code: 'PLO10' }
    ];
    
    // Update CLO-PLO matrix table
    const matrixTable = document.getElementById('clo-plo-matrix-table');
    if (matrixTable) {
        matrixTable.innerHTML = '';
        
        clos.forEach(clo => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${clo.code}</td>`;
            
            plos.forEach(plo => {
                const mapping = matrix.find(m => m.clo_id === clo.id && m.plo_id === plo.id);
                
                if (mapping) {
                    const iconClass = mapping.contribution_level === 'high' ? 'text-danger' : 
                                     mapping.contribution_level === 'medium' ? 'text-primary' : 'text-secondary';
                    row.innerHTML += `<td class="text-center"><i class="bi bi-circle-fill ${iconClass}"></i></td>`;
                } else {
                    row.innerHTML += `<td></td>`;
                }
            });
            
            matrixTable.appendChild(row);
        });
    }
}

// Load classes for a course
function loadClassesForCourse(courseId, selectId) {
    // Simulate API call to get classes for a course
    // In a real application, this would be an actual API call
    let classes = [];
    
    if (courseId === 'ME101') {
        classes = [
            { id: 'C001', name: 'ME101-01' }
        ];
    } else if (courseId === 'ME201') {
        classes = [
            { id: 'C002', name: 'ME201-01' }
        ];
    } else if (courseId === 'ME301') {
        classes = [
            { id: 'C003', name: 'ME301-01' }
        ];
    }
    
    // Update class select
    const classSelect = document.getElementById(selectId);
    if (classSelect) {
        classSelect.innerHTML = '';
        
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            classSelect.appendChild(option);
        });
        
        // Trigger change event to load data
        if (selectId === 'clo-report-class-filter') {
            loadCloReport();
        }
    }
}

// Load CLO report
function loadCloReport() {
    // Get selected course and class
    const courseId = document.getElementById('clo-report-course-filter').value;
    const classId = document.getElementById('clo-report-class-filter').value;
    const semester = document.getElementById('clo-report-semester-filter').value;
    
    // Simulate API call to get CLO report
    // In a real application, this would be an actual API call
    let report = {
        course_id: courseId,
        class_id: classId,
        semester: semester,
        report_date: '2025-05-30',
        clo_results: []
    };
    
    if (courseId === 'ME101' && classId === 'C001') {
        report.clo_results = [
            {
                clo_id: 'CLO1_ME101',
                clo_code: 'CLO1',
                clo_description: 'Mô tả các nguyên lý cơ bản của kỹ thuật cơ khí.',
                total_students: 30,
                passed_students: 25,
                pass_rate: 0.83,
                average_score: 7.8
            },
            {
                clo_id: 'CLO2_ME101',
                clo_code: 'CLO2',
                clo_description: 'Xác định các thành phần cơ bản của hệ thống cơ khí.',
                total_students: 30,
                passed_students: 22,
                pass_rate: 0.73,
                average_score: 7.2
            },
            {
                clo_id: 'CLO3_ME101',
                clo_code: 'CLO3',
                clo_description: 'Sử dụng các công cụ cơ bản trong kỹ thuật cơ khí.',
                total_students: 30,
                passed_students: 28,
                pass_rate: 0.93,
                average_score: 8.1
            }
        ];
    }
    
    // Update CLO report table
    const reportTable = document.getElementById('clo-report-table');
    if (reportTable) {
        reportTable.innerHTML = '';
        
        report.clo_results.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.clo_code}</td>
                <td>${result.clo_description}</td>
                <td>${result.total_students}</td>
                <td>${result.passed_students}</td>
                <td>${(result.pass_rate * 100).toFixed(0)}%</td>
                <td>${result.average_score.toFixed(1)}</td>
            `;
            reportTable.appendChild(row);
        });
    }
    
    // Update CLO report chart
    updateCloReportChart(report.clo_results);
}

// Save PLO
function savePlo() {
    // Get form values
    const programId = document.getElementById('plo-program').value;
    const code = document.getElementById('plo-code').value;
    const description = document.getElementById('plo-description').value;
    const bloomLevel = document.getElementById('plo-bloom').value;
    const category = document.getElementById('plo-category').value;
    const status = document.getElementById('plo-status').value;
    
    // Validate form
    if (!code || !description || !bloomLevel || !category || !status) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    // Simulate API call to save PLO
    // In a real application, this would be an actual API call
    alert('Đã lưu PLO thành công!');
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('plo-modal'));
    modal.hide();
    
    // Reload PLOs
    loadPlos();
}

// Save CLO
function saveClo() {
    // Get form values
    const courseId = document.getElementById('clo-course').value;
    const code = document.getElementById('clo-code').value;
    const description = document.getElementById('clo-description').value;
    const bloomLevel = document.getElementById('clo-bloom').value;
    const category = document.getElementById('clo-category').value;
    const status = document.getElementById('clo-status').value;
    
    // Validate form
    if (!code || !description || !bloomLevel || !category || !status) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    // Simulate API call to save CLO
    // In a real application, this would be an actual API call
    alert('Đã lưu CLO thành công!');
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('clo-modal'));
    modal.hide();
    
    // Reload CLOs
    loadClos(courseId);
}

// Edit PLO
function editPlo(ploId) {
    // Simulate API call to get PLO details
    // In a real application, this would be an actual API call
    const plo = {
        id: ploId,
        program_id: 'ME2025',
        code: ploId,
        description: 'Áp dụng kiến thức toán học, khoa học và kỹ thuật để giải quyết các vấn đề cơ khí phức tạp.',
        bloom_level: 'Áp dụng',
        category: 'Kiến thức',
        status: 'active'
    };
    
    // Set form values
    document.getElementById('plo-program').value = plo.program_id;
    document.getElementById('plo-code').value = plo.code;
    document.getElementById('plo-description').value = plo.description;
    document.getElementById('plo-bloom').value = plo.bloom_level;
    document.getElementById('plo-category').value = plo.category;
    document.getElementById('plo-status').value = plo.status;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('plo-modal'));
    modal.show();
}

// Delete PLO
function deletePlo(ploId) {
    // Confirm deletion
    if (confirm('Bạn có chắc chắn muốn xóa PLO này?')) {
        // Simulate API call to delete PLO
        // In a real application, this would be an actual API call
        alert('Đã xóa PLO thành công!');
        
        // Reload PLOs
        loadPlos();
    }
}

// Edit CLO
function editClo(cloId) {
    // Simulate API call to get CLO details
    // In a real application, this would be an actual API call
    const clo = {
        id: cloId,
        course_id: 'ME101',
        code: 'CLO1',
        description: 'Mô tả các nguyên lý cơ bản của kỹ thuật cơ khí.',
        bloom_level: 'Hiểu',
        category: 'Kiến thức',
        status: 'active'
    };
    
    // Set form values
    document.getElementById('clo-course').value = clo.course_id;
    document.getElementById('clo-code').value = clo.code;
    document.getElementById('clo-description').value = clo.description;
    document.getElementById('clo-bloom').value = clo.bloom_level;
    document.getElementById('clo-category').value = clo.category;
    document.getElementById('clo-status').value = clo.status;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('clo-modal'));
    modal.show();
}

// Delete CLO
function deleteClo(cloId) {
    // Confirm deletion
    if (confirm('Bạn có chắc chắn muốn xóa CLO này?')) {
        // Simulate API call to delete CLO
        // In a real application, this would be an actual API call
        alert('Đã xóa CLO thành công!');
        
        // Reload CLOs
        loadClos(document.getElementById('course-filter').value);
    }
}

// Generate CLO Report
function generateCloReport() {
    // Get selected course and class
    const courseId = document.getElementById('clo-report-course-filter').value;
    const classId = document.getElementById('clo-report-class-filter').value;
    
    // Simulate API call to generate CLO report
    // In a real application, this would be an actual API call
    alert('Đã tạo báo cáo CLO thành công!');
    
    // Load CLO report
    loadCloReport();
}

// Initialize charts
function initCharts() {
    // Initialize PLO chart
    updatePloChart();
    
    // Initialize CLO chart
    updateCloChart();
}

// Update PLO chart
function updatePloChart() {
    const ctx = document.getElementById('plo-chart');
    if (ctx) {
        // Destroy existing chart if it exists
        if (window.ploChart) {
            window.ploChart.destroy();
        }
        
        // Create new chart
        window.ploChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['PLO1', 'PLO2', 'PLO3', 'PLO4', 'PLO5', 'PLO6', 'PLO7', 'PLO8', 'PLO9', 'PLO10'],
                datasets: [{
                    label: 'Tỷ lệ đạt (%)',
                    data: [80, 90, 83, 75, 85, 88, 79, 82, 87, 91],
                    backgroundColor: 'rgba(13, 110, 253, 0.7)',
                    borderColor: 'rgba(13, 110, 253, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Update CLO chart
function updateCloChart() {
    const ctx = document.getElementById('clo-chart');
    if (ctx) {
        // Destroy existing chart if it exists
        if (window.cloChart) {
            window.cloChart.destroy();
        }
        
        // Create new chart
        window.cloChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['CLO1', 'CLO2', 'CLO3'],
                datasets: [{
                    label: 'Tỷ lệ đạt (%)',
                    data: [85, 78, 92],
                    backgroundColor: 'rgba(25, 135, 84, 0.7)',
                    borderColor: 'rgba(25, 135, 84, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Update CLO report chart
function updateCloReportChart(cloResults) {
    const ctx = document.getElementById('clo-report-chart');
    if (ctx) {
        // Destroy existing chart if it exists
        if (window.cloReportChart) {
            window.cloReportChart.destroy();
        }
        
        // Prepare data
        const labels = cloResults.map(result => result.clo_code);
        const passRates = cloResults.map(result => result.pass_rate * 100);
        const averageScores = cloResults.map(result => result.average_score * 10); // Scale to 0-100
        
        // Create new chart
        window.cloReportChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Tỷ lệ đạt (%)',
                        data: passRates,
                        backgroundColor: 'rgba(13, 110, 253, 0.7)',
                        borderColor: 'rgba(13, 110, 253, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Điểm trung bình (%)',
                        data: averageScores,
                        backgroundColor: 'rgba(220, 53, 69, 0.7)',
                        borderColor: 'rgba(220, 53, 69, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw.toFixed(1) + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Utility Functions

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// API request helper with authentication
async function apiRequest(url, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(url, mergedOptions);
        
        if (response.status === 401) {
            // Token expired or invalid
            logout();
            showNotification('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'error');
            return null;
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API request error:', error);
        showNotification(error.message || 'Lỗi kết nối API', 'error');
        return null;
    }
}

// Format date helper
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Format percentage helper
function formatPercentage(value, decimals = 1) {
    return (value * 100).toFixed(decimals) + '%';
}

// Check user permission
function hasPermission(requiredRoles) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.role) return false;
    
    return requiredRoles.includes(user.role);
}

// Loading state helper
function setLoadingState(element, loading = true) {
    if (loading) {
        element.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
    }
}

// Validate form data
function validateRequired(formData, requiredFields) {
    const errors = [];
    
    requiredFields.forEach(field => {
        if (!formData[field] || formData[field].toString().trim() === '') {
            errors.push(`${field} là trường bắt buộc`);
        }
    });
    
    return errors;
}

// Export data to CSV
function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
        showNotification('Không có dữ liệu để xuất', 'warning');
        return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
