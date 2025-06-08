// main.js - Frontend JavaScript for EAUT Assessment Platform

// Global state management
const AppState = {
  currentUser: null,
  currentPage: 'dashboard',
  token: localStorage.getItem('auth_token'),
  programs: [],
  courses: [],
  plos: [],
  clos: [],
  students: [],
  classes: [],
  assessmentGroups: [],
  questions: [],
  scores: [],
  reports: {
    clo: [],
    plo: []
  }
};

// Configuration
const CONFIG = {
  API_BASE_URL: window.location.origin + '/api',
  ITEMS_PER_PAGE: 10,
  CHART_COLORS: [
    '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#f1c40f'
  ]
};

// Utility functions
const Utils = {
  // Format date
  formatDate: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN');
  },

  // Format percentage
  formatPercent: (value) => {
    if (value === null || value === undefined) return '0%';
    return (value * 100).toFixed(1) + '%';
  },

  // Format score
  formatScore: (score) => {
    if (score === null || score === undefined) return '0.0';
    return parseFloat(score).toFixed(1);
  },

  // Generate unique ID
  generateId: (prefix = 'ID') => {
    return prefix + Date.now() + Math.random().toString(36).substr(2, 5);
  },

  // Validate email
  isValidEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Show loading
  showLoading: (container) => {
    const element = typeof container === 'string' ? document.getElementById(container) : container;
    if (element) {
      element.innerHTML = `
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mt-2">Đang tải dữ liệu...</p>
        </div>
      `;
    }
  },

  // Export to CSV
  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) {
      UI.showNotification('Không có dữ liệu để xuất', 'warning');
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
};

// API service
const API = {
  // Make authenticated request
  async request(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Add auth token if available
    if (AppState.token) {
      config.headers['Authorization'] = `Bearer ${AppState.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // Authentication
  async login(username, password) {
    return await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },

  // Programs
  async getPrograms() {
    return await this.request('/programs');
  },

  async createProgram(program) {
    return await this.request('/programs', {
      method: 'POST',
      body: JSON.stringify(program)
    });
  },

  async getProgram(id) {
    return await this.request(`/programs/${id}`);
  },

  // PLOs
  async getPLOs(programId) {
    return await this.request(`/programs/${programId}/plos`);
  },

  async createPLO(plo) {
    return await this.request('/plos', {
      method: 'POST',
      body: JSON.stringify(plo)
    });
  },

  async updatePLO(id, plo) {
    return await this.request(`/plos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(plo)
    });
  },

  async deletePLO(id) {
    return await this.request(`/plos/${id}`, {
      method: 'DELETE'
    });
  },

  // Courses
  async getCourses(programId) {
    return await this.request(`/programs/${programId}/courses`);
  },

  async getAllCourses() {
    return await this.request('/courses');
  },

  async createCourse(course) {
    return await this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(course)
    });
  },

  async updateCourse(id, course) {
    return await this.request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(course)
    });
  },

  async deleteCourse(id) {
    return await this.request(`/courses/${id}`, {
      method: 'DELETE'
    });
  },

  // CLOs
  async getCLOs(courseId) {
    return await this.request(`/courses/${courseId}/clos`);
  },

  async createCLO(clo) {
    return await this.request('/clos', {
      method: 'POST',
      body: JSON.stringify(clo)
    });
  },

  async updateCLO(id, clo) {
    return await this.request(`/clos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clo)
    });
  },

  async deleteCLO(id) {
    return await this.request(`/clos/${id}`, {
      method: 'DELETE'
    });
  },

  // Assessment Groups
  async getAssessmentGroups(courseId) {
    return await this.request(`/courses/${courseId}/assessment-groups`);
  },

  async getAllAssessmentGroups() {
    return await this.request('/assessment-groups');
  },

  async createAssessmentGroup(group) {
    return await this.request('/assessment-groups', {
      method: 'POST',
      body: JSON.stringify(group)
    });
  },

  async updateAssessmentGroup(id, group) {
    return await this.request(`/assessment-groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(group)
    });
  },

  async deleteAssessmentGroup(id) {
    return await this.request(`/assessment-groups/${id}`, {
      method: 'DELETE'
    });
  },

  // Questions
  async getQuestions(groupId) {
    return await this.request(`/assessment-groups/${groupId}/questions`);
  },

  async getAllQuestions() {
    return await this.request('/questions');
  },

  async createQuestion(question) {
    return await this.request('/questions', {
      method: 'POST',
      body: JSON.stringify(question)
    });
  },

  async updateQuestion(id, question) {
    return await this.request(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(question)
    });
  },

  async deleteQuestion(id) {
    return await this.request(`/questions/${id}`, {
      method: 'DELETE'
    });
  },

  // Scores
  async getScores(classId, studentId) {
    return await this.request(`/classes/${classId}/students/${studentId}/scores`);
  },

  async getAllScores() {
    return await this.request('/scores');
  },

  async saveScore(score) {
    return await this.request('/scores', {
      method: 'POST',
      body: JSON.stringify(score)
    });
  },

  async bulkUploadScores(file) {
    const formData = new FormData();
    formData.append('scoresFile', file);
    
    return await this.request('/scores/bulk-upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AppState.token}`
      },
      body: formData
    });
  },

  // Reports
  async generateCLOReport(courseId, classId) {
    return await this.request(`/courses/${courseId}/classes/${classId}/clo-report`);
  },

  async generatePLOReport(programId, cohort, academicYear) {
    return await this.request(`/programs/${programId}/plo-report?cohort=${cohort}&academicYear=${academicYear}`);
  },

  // Users
  async getUsers() {
    return await this.request('/users');
  },

  async createUser(user) {
    return await this.request('/users', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  },

  async updateUser(id, user) {
    return await this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user)
    });
  },

  async deleteUser(id) {
    return await this.request(`/users/${id}`, {
      method: 'DELETE'
    });
  },

  // Departments
  async getDepartments() {
    return await this.request('/departments');
  },

  async createDepartment(department) {
    return await this.request('/departments', {
      method: 'POST',
      body: JSON.stringify(department)
    });
  },

  async updateDepartment(id, department) {
    return await this.request(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(department)
    });
  },

  async deleteDepartment(id) {
    return await this.request(`/departments/${id}`, {
      method: 'DELETE'
    });
  },

  // Roles
  async getRoles() {
    return await this.request('/roles');
  },

  // Students
  async getStudents(programId, cohort) {
    let url = '/students';
    const params = [];
    if (programId) params.push(`program_id=${programId}`);
    if (cohort) params.push(`cohort=${cohort}`);
    if (params.length > 0) url += '?' + params.join('&');
    
    return await this.request(url);
  },

  // Classes
  async getClasses(courseId, lecturerId) {
    let url = '/classes';
    const params = [];
    if (courseId) params.push(`course_id=${courseId}`);
    if (lecturerId) params.push(`lecturer_id=${lecturerId}`);
    if (params.length > 0) url += '?' + params.join('&');
    
    return await this.request(url);
  }
};

// UI Management
const UI = {
  // Show notification
  showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification-toast');
    existingNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification-toast alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
    `;
    
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto remove after duration
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, duration);
  },

  // Show modal
  showModal(title, content, actions = []) {
    const modalId = 'dynamicModal';
    let modal = document.getElementById(modalId);
    
    if (!modal) {
      modal = document.createElement('div');
      modal.id = modalId;
      modal.className = 'modal fade';
      document.body.appendChild(modal);
    }

    const actionsHtml = actions.map(action => 
      `<button type="button" class="btn btn-${action.type || 'secondary'}" ${action.onClick ? `onclick="${action.onClick}"` : ''}>${action.text}</button>`
    ).join('');

    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          <div class="modal-footer">
            ${actionsHtml}
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    `;

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    return bsModal;
  },

  // Confirm dialog
  async confirm(message, title = 'Xác nhận') {
    return new Promise((resolve) => {
      const modal = this.showModal(title, `<p>${message}</p>`, [
        {
          text: 'Xác nhận',
          type: 'danger',
          onClick: `document.getElementById('dynamicModal').dispatchEvent(new CustomEvent('confirmed')); bootstrap.Modal.getInstance(document.getElementById('dynamicModal')).hide();`
        }
      ]);

      document.getElementById('dynamicModal').addEventListener('confirmed', () => {
        resolve(true);
      }, { once: true });

      document.getElementById('dynamicModal').addEventListener('hidden.bs.modal', () => {
        resolve(false);
      }, { once: true });
    });
  },

  // Show/hide pages
  showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => page.classList.add('d-none'));

    // Show selected page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
      targetPage.classList.remove('d-none');
    }

    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`[href="#${pageId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }

    AppState.currentPage = pageId;
  },

  // Update dashboard stats
  updateDashboardStats() {
    document.getElementById('program-count').textContent = AppState.programs.length;
    document.getElementById('course-count').textContent = AppState.courses.length;
    document.getElementById('student-count').textContent = AppState.students.length;
    document.getElementById('class-count').textContent = AppState.classes.length;
  },

  // Create data table
  createDataTable(containerId, columns, data, actions = []) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const tableHtml = `
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              ${columns.map(col => `<th>${col.title}</th>`).join('')}
              ${actions.length > 0 ? '<th>Thao tác</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${data.map((row, index) => `
              <tr>
                ${columns.map(col => `<td>${this.getCellValue(row, col)}</td>`).join('')}
                ${actions.length > 0 ? `<td>${this.createActionButtons(actions, row, index)}</td>` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = tableHtml;
  },

  getCellValue(row, column) {
    const value = row[column.key];
    
    if (column.type === 'date') {
      return Utils.formatDate(value);
    } else if (column.type === 'percent') {
      return Utils.formatPercent(value);
    } else if (column.type === 'score') {
      return Utils.formatScore(value);
    } else if (column.type === 'status') {
      const statusClass = value === 'active' ? 'success' : 'secondary';
      const statusText = value === 'active' ? 'Hoạt động' : 'Không hoạt động';
      return `<span class="badge bg-${statusClass}">${statusText}</span>`;
    }
    
    return value || '';
  },

  createActionButtons(actions, row, index) {
    return actions.map(action => 
      `<button class="btn btn-sm btn-${action.type || 'primary'} me-1" 
              onclick="${action.onClick}(${JSON.stringify(row).replace(/"/g, '&quot;')}, ${index})"
              ${action.disabled ? 'disabled' : ''}>
         <i class="bi bi-${action.icon}"></i> ${action.text || ''}
       </button>`
    ).join('');
  },

  // Create chart
  createChart(canvasId, type, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if exists
    if (canvas.chart) {
      canvas.chart.destroy();
    }

    canvas.chart = new Chart(ctx, {
      type: type,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...options
      }
    });

    return canvas.chart;
  }
};

// Authentication
const Auth = {
  async login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
      UI.showNotification('Vui lòng nhập đầy đủ thông tin đăng nhập', 'warning');
      return;
    }

    try {
      const loginBtn = document.querySelector('#login-form button[type="submit"]');
      loginBtn.disabled = true;
      loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang đăng nhập...';

      const response = await API.login(username, password);
      
      if (response.success && response.data) {
        AppState.currentUser = response.data;
        AppState.token = response.data.token;
        localStorage.setItem('auth_token', AppState.token);
        
        // Update UI
        document.getElementById('user-fullname').textContent = response.data.fullName;
        document.getElementById('login-page').classList.add('d-none');
        document.getElementById('main-app').classList.remove('d-none');
        
        // Load initial data
        await this.loadInitialData();
        
        UI.showNotification('Đăng nhập thành công!', 'success');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Login failed:', error);
      UI.showNotification('Đăng nhập thất bại: ' + error.message, 'danger');
    } finally {
      const loginBtn = document.querySelector('#login-form button[type="submit"]');
      loginBtn.disabled = false;
      loginBtn.innerHTML = 'Đăng nhập';
    }
  },

  async loadInitialData() {
    try {
      // Load programs
      AppState.programs = await API.getPrograms();
      
      // Load students
      AppState.students = await API.getStudents();
      
      // Load classes  
      AppState.classes = await API.getClasses();
      
      // Update dashboard
      UI.updateDashboardStats();
      
      // Load programs into dropdowns
      this.populateDropdowns();
      
    } catch (error) {
      console.error('Failed to load initial data:', error);
      UI.showNotification('Không thể tải dữ liệu ban đầu', 'warning');
    }
  },

  populateDropdowns() {
    // Populate program dropdowns
    const programSelects = document.querySelectorAll('select[name="program_id"]');
    programSelects.forEach(select => {
      select.innerHTML = '<option value="">Chọn chương trình</option>' +
        AppState.programs.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    });
  },

  logout() {
    AppState.currentUser = null;
    AppState.token = null;
    localStorage.removeItem('auth_token');
    
    document.getElementById('main-app').classList.add('d-none');
    document.getElementById('login-page').classList.remove('d-none');
    
    // Clear form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    UI.showNotification('Đã đăng xuất', 'info');
  },

  checkAuthOnLoad() {
    if (AppState.token) {
      // Try to validate token by making a test API call
      API.request('/health')
        .then(() => {
          document.getElementById('login-page').classList.add('d-none');
          document.getElementById('main-app').classList.remove('d-none');
          this.loadInitialData();
        })
        .catch(() => {
          // Token is invalid
          this.logout();
        });
    }
  }
};

// Page controllers
const Pages = {
  // Dashboard
  async loadDashboard() {
    UI.showPage('dashboard');
    
    try {
      // Load recent activities or statistics
      const recentReports = AppState.reports.clo.slice(0, 5);
      
      // Update recent reports table
      if (recentReports.length > 0) {
        const tableHtml = recentReports.map(report => `
          <tr>
            <td>${report.course_name || 'N/A'}</td>
            <td>${Utils.formatDate(report.report_date)}</td>
            <td><span class="badge bg-success">Hoàn thành</span></td>
            <td>
              <button class="btn btn-sm btn-primary" onclick="Pages.viewReport('${report.report_id}')">
                <i class="bi bi-eye"></i>
              </button>
            </td>
          </tr>
        `).join('');
        
        document.getElementById('recent-reports-body').innerHTML = tableHtml;
      }
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  },

  // PLO Management
  async loadPLOManagement() {
    UI.showPage('plo-management');
    
    try {
      Utils.showLoading('plo-list');
      
      // Get selected program
      const programSelect = document.getElementById('plo-program-select');
      const programId = programSelect.value;
      
      if (!programId) {
        document.getElementById('plo-list').innerHTML = '<p class="text-muted">Vui lòng chọn chương trình đào tạo</p>';
        return;
      }
      
      const plos = await API.getPLOs(programId);
      AppState.plos = plos;
      
      const columns = [
        { key: 'code', title: 'Mã PLO' },
        { key: 'description', title: 'Mô tả' },
        { key: 'bloom_level', title: 'Mức độ Bloom' },
        { key: 'category', title: 'Phân loại' },
        { key: 'status', title: 'Trạng thái', type: 'status' }
      ];
      
      const actions = [
        { icon: 'pencil', text: 'Sửa', type: 'warning', onClick: 'Pages.editPLO' },
        { icon: 'trash', text: 'Xóa', type: 'danger', onClick: 'Pages.deletePLO' }
      ];
      
      UI.createDataTable('plo-list', columns, plos, actions);
      
    } catch (error) {
      console.error('Error loading PLOs:', error);
      UI.showNotification('Lỗi khi tải danh sách PLO', 'danger');
    }
  },

  // Course Management  
  async loadCourseManagement() {
    UI.showPage('course-management');
    
    try {
      Utils.showLoading('course-list');
      
      const programSelect = document.getElementById('course-program-select');
      const programId = programSelect.value;
      
      if (!programId) {
        document.getElementById('course-list').innerHTML = '<p class="text-muted">Vui lòng chọn chương trình đào tạo</p>';
        return;
      }
      
      const courses = await API.getCourses(programId);
      AppState.courses = courses;
      
      const columns = [
        { key: 'code', title: 'Mã học phần' },
        { key: 'name', title: 'Tên học phần' },
        { key: 'credits', title: 'Số tín chỉ' },
        { key: 'semester', title: 'Học kỳ' },
        { key: 'status', title: 'Trạng thái', type: 'status' }
      ];
      
      const actions = [
        { icon: 'eye', text: 'Xem', type: 'info', onClick: 'Pages.viewCourse' },
        { icon: 'pencil', text: 'Sửa', type: 'warning', onClick: 'Pages.editCourse' },
        { icon: 'trash', text: 'Xóa', type: 'danger', onClick: 'Pages.deleteCourse' }
      ];
      
      UI.createDataTable('course-list', columns, courses, actions);
      
    } catch (error) {
      console.error('Error loading courses:', error);
      UI.showNotification('Lỗi khi tải danh sách học phần', 'danger');
    }
  },

  async editCourse(id) {
    try {
      const course = AppState.courses.find(c => c.id === id);
      if (!course) {
        UI.showNotification('Không tìm thấy học phần', 'warning');
        return;
      }

      const content = `
        <form id="edit-course-form">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Mã học phần</label>
                <input type="text" class="form-control" name="code" value="${course.code}" required>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Số tín chỉ</label>
                <input type="number" class="form-control" name="credits" value="${course.credits}" min="1" max="10" required>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Tên học phần</label>
            <input type="text" class="form-control" name="name" value="${course.name}" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Mô tả</label>
            <textarea class="form-control" name="description" rows="3">${course.description || ''}</textarea>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Học phần tiên quyết</label>
                <input type="text" class="form-control" name="prerequisites" value="${course.prerequisites || ''}" placeholder="Ví dụ: MATH101, PHYS101">
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Học kỳ</label>
                <select class="form-control" name="semester" required>
                  <option value="">Chọn học kỳ</option>
                  ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}" ${course.semester == s ? 'selected' : ''}>Học kỳ ${s}</option>`).join('')}
                </select>
              </div>
            </div>
          </div>
        </form>
      `;

      UI.showModal('Chỉnh sửa học phần', content, [
        {
          text: 'Cập nhật',
          type: 'primary',
          onClick: `Pages.updateCourse('${id}')`
        }
      ]);
    } catch (error) {
      console.error('Error editing course:', error);
      UI.showNotification('Lỗi khi tải thông tin học phần', 'danger');
    }
  },

  async updateCourse(id) {
    try {
      const form = document.getElementById('edit-course-form');
      const formData = new FormData(form);
      
      const course = {
        code: formData.get('code'),
        name: formData.get('name'),
        credits: parseInt(formData.get('credits')),
        description: formData.get('description'),
        prerequisites: formData.get('prerequisites'),
        semester: parseInt(formData.get('semester'))
      };

      await API.updateCourse(id, course);
      
      bootstrap.Modal.getInstance(document.getElementById('dynamicModal')).hide();
      await this.loadCourseManagement();
      
      UI.showNotification('Cập nhật học phần thành công!', 'success');
      
    } catch (error) {
      console.error('Error updating course:', error);
      UI.showNotification('Lỗi khi cập nhật học phần: ' + error.message, 'danger');
    }
  },

  async deleteCourse(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa học phần này?')) {
      return;
    }

    try {
      await API.deleteCourse(id);
      await this.loadCourseManagement();
      UI.showNotification('Xóa học phần thành công!', 'success');
    } catch (error) {
      console.error('Error deleting course:', error);
      UI.showNotification('Lỗi khi xóa học phần: ' + error.message, 'danger');
    }
  },

  // Assessment Groups Management
  async loadAssessmentGroupsManagement() {
    UI.showPage('assessment-groups-management');
    
    try {
      Utils.showLoading('assessment-groups-list');
      
      const groups = await API.getAllAssessmentGroups();
      AppState.assessmentGroups = groups;
      
      const columns = [
        { key: 'name', title: 'Tên nhóm đánh giá' },
        { key: 'course_code', title: 'Mã học phần' },
        { key: 'course_name', title: 'Tên học phần' },
        { key: 'weight', title: 'Trọng số (%)', format: value => `${(value * 100).toFixed(1)}%` },
        { key: 'description', title: 'Mô tả' }
      ];
      
      const actions = [
        { icon: 'pencil', text: 'Sửa', type: 'warning', onClick: 'Pages.editAssessmentGroup' },
        { icon: 'trash', text: 'Xóa', type: 'danger', onClick: 'Pages.deleteAssessmentGroup' }
      ];
      
      UI.createDataTable('assessment-groups-list', columns, groups, actions);
      
    } catch (error) {
      console.error('Error loading assessment groups:', error);
      UI.showNotification('Lỗi khi tải danh sách nhóm đánh giá', 'danger');
    }
  },

  showCreateAssessmentGroupModal() {
    const content = `
      <form id="create-assessment-group-form">
        <div class="mb-3">
          <label class="form-label">Học phần</label>
          <select class="form-control" name="course_id" required id="ag-course-select">
            <option value="">Chọn học phần</option>
            ${AppState.courses.map(c => `<option value="${c.id}">${c.code} - ${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Tên nhóm đánh giá</label>
          <input type="text" class="form-control" name="name" required placeholder="Ví dụ: Bài tập, Giữa kỳ, Cuối kỳ">
        </div>
        <div class="mb-3">
          <label class="form-label">Trọng số (%)</label>
          <input type="number" class="form-control" name="weight" min="1" max="100" required placeholder="10">
        </div>
        <div class="mb-3">
          <label class="form-label">Mô tả</label>
          <textarea class="form-control" name="description" rows="3" placeholder="Mô tả chi tiết về nhóm đánh giá"></textarea>
        </div>
      </form>
    `;

    UI.showModal('Tạo nhóm đánh giá mới', content, [
      {
        text: 'Tạo nhóm',
        type: 'primary',
        onClick: 'Pages.createAssessmentGroup()'
      }
    ]);
  },

  async createAssessmentGroup() {
    try {
      const form = document.getElementById('create-assessment-group-form');
      const formData = new FormData(form);
      
      const group = {
        id: Utils.generateId('AG'),
        course_id: formData.get('course_id'),
        name: formData.get('name'),
        weight: parseFloat(formData.get('weight')) / 100,
        description: formData.get('description')
      };

      await API.createAssessmentGroup(group);
      
      bootstrap.Modal.getInstance(document.getElementById('dynamicModal')).hide();
      await this.loadAssessmentGroupsManagement();
      
      UI.showNotification('Tạo nhóm đánh giá thành công!', 'success');
      
    } catch (error) {
      console.error('Error creating assessment group:', error);
      UI.showNotification('Lỗi khi tạo nhóm đánh giá: ' + error.message, 'danger');
    }
  },

  async deleteAssessmentGroup(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa nhóm đánh giá này?')) {
      return;
    }

    try {
      await API.deleteAssessmentGroup(id);
      await this.loadAssessmentGroupsManagement();
      UI.showNotification('Xóa nhóm đánh giá thành công!', 'success');
    } catch (error) {
      console.error('Error deleting assessment group:', error);
      UI.showNotification('Lỗi khi xóa nhóm đánh giá: ' + error.message, 'danger');
    }
  },

  // Questions Management
  async loadQuestionsManagement() {
    UI.showPage('questions-management');
    
    try {
      Utils.showLoading('questions-list');
      
      const questions = await API.getAllQuestions();
      AppState.questions = questions;
      
      const columns = [
        { key: 'content', title: 'Nội dung câu hỏi' },
        { key: 'assessment_group_name', title: 'Nhóm đánh giá' },
        { key: 'course_code', title: 'Học phần' },
        { key: 'max_score', title: 'Điểm tối đa' },
        { key: 'clo_code', title: 'CLO' }
      ];
      
      const actions = [
        { icon: 'pencil', text: 'Sửa', type: 'warning', onClick: 'Pages.editQuestion' },
        { icon: 'trash', text: 'Xóa', type: 'danger', onClick: 'Pages.deleteQuestion' }
      ];
      
      UI.createDataTable('questions-list', columns, questions, actions);
      
    } catch (error) {
      console.error('Error loading questions:', error);
      UI.showNotification('Lỗi khi tải danh sách câu hỏi', 'danger');
    }
  },

  showCreateQuestionModal() {
    const content = `
      <form id="create-question-form">
        <div class="mb-3">
          <label class="form-label">Nhóm đánh giá</label>
          <select class="form-control" name="assessment_group_id" required id="q-assessment-group-select">
            <option value="">Chọn nhóm đánh giá</option>
            ${AppState.assessmentGroups.map(ag => `<option value="${ag.id}">${ag.name} - ${ag.course_code}</option>`).join('')}
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Nội dung câu hỏi/tiêu chí</label>
          <textarea class="form-control" name="content" rows="3" required placeholder="Nhập nội dung câu hỏi hoặc tiêu chí đánh giá"></textarea>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Điểm tối đa</label>
              <input type="number" class="form-control" name="max_score" min="0.1" step="0.1" required placeholder="10">
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">CLO</label>
              <select class="form-control" name="clo_id" required>
                <option value="">Chọn CLO</option>
                ${AppState.clos.map(clo => `<option value="${clo.id}">${clo.code} - ${clo.description}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Ghi chú</label>
          <textarea class="form-control" name="notes" rows="2" placeholder="Ghi chú thêm về câu hỏi"></textarea>
        </div>
      </form>
    `;

    UI.showModal('Tạo câu hỏi/tiêu chí mới', content, [
      {
        text: 'Tạo câu hỏi',
        type: 'primary',
        onClick: 'Pages.createQuestion()'
      }
    ]);
  },

  async createQuestion() {
    try {
      const form = document.getElementById('create-question-form');
      const formData = new FormData(form);
      
      const question = {
        id: Utils.generateId('Q'),
        assessment_group_id: formData.get('assessment_group_id'),
        content: formData.get('content'),
        max_score: parseFloat(formData.get('max_score')),
        clo_id: formData.get('clo_id'),
        notes: formData.get('notes')
      };

      await API.createQuestion(question);
      
      bootstrap.Modal.getInstance(document.getElementById('dynamicModal')).hide();
      await this.loadQuestionsManagement();
      
      UI.showNotification('Tạo câu hỏi thành công!', 'success');
      
    } catch (error) {
      console.error('Error creating question:', error);
      UI.showNotification('Lỗi khi tạo câu hỏi: ' + error.message, 'danger');
    }
  },

  async deleteQuestion(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      return;
    }

    try {
      await API.deleteQuestion(id);
      await this.loadQuestionsManagement();
      UI.showNotification('Xóa câu hỏi thành công!', 'success');
    } catch (error) {
      console.error('Error deleting question:', error);
      UI.showNotification('Lỗi khi xóa câu hỏi: ' + error.message, 'danger');
    }
  },

  // User Management
  async loadUserManagement() {
    UI.showPage('user-management');
    
    try {
      Utils.showLoading('users-list');
      
      const [users, departments, roles] = await Promise.all([
        API.getUsers(),
        API.getDepartments(),
        API.getRoles()
      ]);
      
      AppState.users = users;
      AppState.departments = departments;
      AppState.roles = roles;
      
      // Populate filter dropdowns
      const roleFilter = document.getElementById('user-role-filter');
      roleFilter.innerHTML = '<option value="">Tất cả vai trò</option>' +
        roles.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
      
      const deptFilter = document.getElementById('user-department-filter');
      deptFilter.innerHTML = '<option value="">Tất cả khoa/bộ môn</option>' +
        departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
      
      this.renderUsersList(users);
      
    } catch (error) {
      console.error('Error loading users:', error);
      UI.showNotification('Lỗi khi tải danh sách người dùng', 'danger');
    }
  },

  renderUsersList(users) {
    const columns = [
      { key: 'username', title: 'Tên đăng nhập' },
      { key: 'full_name', title: 'Họ và tên' },
      { key: 'email', title: 'Email' },
      { key: 'role_name', title: 'Vai trò' },
      { key: 'department_name', title: 'Khoa/Bộ môn' },
      { key: 'status', title: 'Trạng thái', type: 'status' }
    ];
    
    const actions = [
      { icon: 'pencil', text: 'Sửa', type: 'warning', onClick: 'Pages.editUser' },
      { icon: 'trash', text: 'Xóa', type: 'danger', onClick: 'Pages.deleteUser' }
    ];
    
    UI.createDataTable('users-list', columns, users, actions);
  },

  filterUsers() {
    const roleFilter = document.getElementById('user-role-filter').value;
    const deptFilter = document.getElementById('user-department-filter').value;
    const searchTerm = document.getElementById('user-search').value.toLowerCase();
    
    let filteredUsers = AppState.users;
    
    if (roleFilter) {
      filteredUsers = filteredUsers.filter(u => u.role_id == roleFilter);
    }
    
    if (deptFilter) {
      filteredUsers = filteredUsers.filter(u => u.department_id == deptFilter);
    }
    
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(u => 
        u.username.toLowerCase().includes(searchTerm) ||
        u.full_name.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm)
      );
    }
    
    this.renderUsersList(filteredUsers);
  },

  showCreateUserModal() {
    const content = `
      <form id="create-user-form">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Tên đăng nhập</label>
              <input type="text" class="form-control" name="username" required>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Mật khẩu</label>
              <input type="password" class="form-control" name="password" required>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Họ và tên</label>
          <input type="text" class="form-control" name="full_name" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" name="email" required>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Vai trò</label>
              <select class="form-control" name="role_id" required>
                <option value="">Chọn vai trò</option>
                ${AppState.roles.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Khoa/Bộ môn</label>
              <select class="form-control" name="department_id" required>
                <option value="">Chọn khoa/bộ môn</option>
                ${AppState.departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
      </form>
    `;

    UI.showModal('Tạo người dùng mới', content, [
      {
        text: 'Tạo người dùng',
        type: 'primary',
        onClick: 'Pages.createUser()'
      }
    ]);
  },

  async createUser() {
    try {
      const form = document.getElementById('create-user-form');
      const formData = new FormData(form);
      
      const user = {
        username: formData.get('username'),
        password: formData.get('password'),
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        role_id: formData.get('role_id'),
        department_id: formData.get('department_id'),
        status: 'active'
      };

      await API.createUser(user);
      
      bootstrap.Modal.getInstance(document.getElementById('dynamicModal')).hide();
      await this.loadUserManagement();
      
      UI.showNotification('Tạo người dùng thành công!', 'success');
      
    } catch (error) {
      console.error('Error creating user:', error);
      UI.showNotification('Lỗi khi tạo người dùng: ' + error.message, 'danger');
    }
  },

  async deleteUser(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      await API.deleteUser(id);
      await this.loadUserManagement();
      UI.showNotification('Xóa người dùng thành công!', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      UI.showNotification('Lỗi khi xóa người dùng: ' + error.message, 'danger');
    }
  },

  // Department Management
  async loadDepartmentManagement() {
    UI.showPage('department-management');
    
    try {
      Utils.showLoading('departments-list');
      
      const departments = await API.getDepartments();
      AppState.departments = departments;
      
      const columns = [
        { key: 'code', title: 'Mã khoa/bộ môn' },
        { key: 'name', title: 'Tên khoa/bộ môn' },
        { key: 'description', title: 'Mô tả' },
        { key: 'head_name', title: 'Trưởng khoa/bộ môn' },
        { key: 'status', title: 'Trạng thái', type: 'status' }
      ];
      
      const actions = [
        { icon: 'pencil', text: 'Sửa', type: 'warning', onClick: 'Pages.editDepartment' },
        { icon: 'trash', text: 'Xóa', type: 'danger', onClick: 'Pages.deleteDepartment' }
      ];
      
      UI.createDataTable('departments-list', columns, departments, actions);
      
    } catch (error) {
      console.error('Error loading departments:', error);
      UI.showNotification('Lỗi khi tải danh sách khoa/bộ môn', 'danger');
    }
  },

  showCreateDepartmentModal() {
    const content = `
      <form id="create-department-form">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Mã khoa/bộ môn</label>
              <input type="text" class="form-control" name="code" required placeholder="Ví dụ: MECH, IT, CIVIL">
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Trưởng khoa/bộ môn</label>
              <select class="form-control" name="head_id">
                <option value="">Chọn trưởng khoa</option>
                ${AppState.users.filter(u => u.role_name === 'Giảng viên' || u.role_name === 'Trưởng khoa').map(u => `<option value="${u.id}">${u.full_name}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Tên khoa/bộ môn</label>
          <input type="text" class="form-control" name="name" required placeholder="Ví dụ: Khoa Cơ khí">
        </div>
        <div class="mb-3">
          <label class="form-label">Mô tả</label>
          <textarea class="form-control" name="description" rows="3" placeholder="Mô tả về khoa/bộ môn"></textarea>
        </div>
      </form>
    `;

    UI.showModal('Tạo khoa/bộ môn mới', content, [
      {
        text: 'Tạo khoa/bộ môn',
        type: 'primary',
        onClick: 'Pages.createDepartment()'
      }
    ]);
  },

  async createDepartment() {
    try {
      const form = document.getElementById('create-department-form');
      const formData = new FormData(form);
      
      const department = {
        code: formData.get('code'),
        name: formData.get('name'),
        description: formData.get('description'),
        head_id: formData.get('head_id') || null,
        status: 'active'
      };

      await API.createDepartment(department);
      
      bootstrap.Modal.getInstance(document.getElementById('dynamicModal')).hide();
      await this.loadDepartmentManagement();
      
      UI.showNotification('Tạo khoa/bộ môn thành công!', 'success');
      
    } catch (error) {
      console.error('Error creating department:', error);
      UI.showNotification('Lỗi khi tạo khoa/bộ môn: ' + error.message, 'danger');
    }
  },

  async deleteDepartment(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa khoa/bộ môn này?')) {
      return;
    }

    try {
      await API.deleteDepartment(id);
      await this.loadDepartmentManagement();
      UI.showNotification('Xóa khoa/bộ môn thành công!', 'success');
    } catch (error) {
      console.error('Error deleting department:', error);
      UI.showNotification('Lỗi khi xóa khoa/bộ môn: ' + error.message, 'danger');
    }
  },

  // Score Management
  async loadScoreManagement() {
    UI.showPage('scores');
    
    try {
      // Load classes for score entry
      const classes = await API.getClasses();
      const classSelect = document.getElementById('score-class-select');
      
      classSelect.innerHTML = '<option value="">Chọn lớp học</option>' +
        classes.map(c => `<option value="${c.id}">${c.course_code} - ${c.name} (${c.semester})</option>`).join('');
      
    } catch (error) {
      console.error('Error loading score management:', error);
    }
  },

  async handleBulkUpload() {
    const fileInput = document.getElementById('bulk-upload-file');
    const file = fileInput.files[0];
    
    if (!file) {
      UI.showNotification('Vui lòng chọn file để tải lên', 'warning');
      return;
    }
    
    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      UI.showNotification('Chỉ chấp nhận file Excel (.xlsx, .xls) hoặc CSV', 'warning');
      return;
    }
    
    try {
      const uploadBtn = document.getElementById('upload-scores-btn');
      uploadBtn.disabled = true;
      uploadBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang tải lên...';
      
      const result = await API.bulkUploadScores(file);
      
      if (result.success) {
        UI.showNotification(`Tải lên thành công! Đã xử lý ${result.processedCount} điểm`, 'success');
        
        // Show upload results
        if (result.errors && result.errors.length > 0) {
          const errorsList = result.errors.map(err => `<li>Dòng ${err.row}: ${err.message}</li>`).join('');
          const alertHtml = `
            <div class="alert alert-warning mt-3">
              <h6>Một số lỗi đã xảy ra:</h6>
              <ul class="mb-0">${errorsList}</ul>
            </div>
          `;
          document.getElementById('upload-results').innerHTML = alertHtml;
        }
        
        // Clear file input
        fileInput.value = '';
      } else {
        throw new Error(result.error || 'Upload failed');
      }
      
    } catch (error) {
      console.error('Error uploading scores:', error);
      UI.showNotification('Lỗi khi tải lên điểm: ' + error.message, 'danger');
    } finally {
      const uploadBtn = document.getElementById('upload-scores-btn');
      uploadBtn.disabled = false;
      uploadBtn.innerHTML = 'Tải lên điểm';
    }
  },

  async editCourse(id) {
    try {
      const course = AppState.courses.find(c => c.id === id);
      if (!course) {
        UI.showNotification('Không tìm thấy học phần', 'warning');
        return;
      }

      const content = `
        <form id="edit-course-form">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Mã học phần</label>
                <input type="text" class="form-control" name="code" value="${course.code}" required>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Số tín chỉ</label>
                <input type="number" class="form-control" name="credits" value="${course.credits}" min="1" max="10" required>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Tên học phần</label>
            <input type="text" class="form-control" name="name" value="${course.name}" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Mô tả</label>
            <textarea class="form-control" name="description" rows="3">${course.description || ''}</textarea>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Học phần tiên quyết</label>
                <input type="text" class="form-control" name="prerequisites" value="${course.prerequisites || ''}" placeholder="Ví dụ: MATH101, PHYS101">
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Học kỳ</label>
                <select class="form-control" name="semester" required>
                  <option value="">Chọn học kỳ</option>
                  ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}" ${course.semester == s ? 'selected' : ''}>Học kỳ ${s}</option>`).join('')}
                </select>
              </div>
            </div>
          </div>
        </form>
      `;

      UI.showModal('Chỉnh sửa học phần', content, [
        {
          text: 'Cập nhật',
          type: 'primary',
          onClick: `Pages.updateCourse('${id}')`
        }
      ]);
    } catch (error) {
      console.error('Error editing course:', error);
      UI.showNotification('Lỗi khi tải thông tin học phần', 'danger');
    }
  },

  async updateCourse(id) {
    try {
      const form = document.getElementById('edit-course-form');
      const formData = new FormData(form);
      
      const course = {
        code: formData.get('code'),
        name: formData.get('name'),
        credits: parseInt(formData.get('credits')),
        description: formData.get('description'),
        prerequisites: formData.get('prerequisites'),
        semester: parseInt(formData.get('semester'))
      };

      await API.updateCourse(id, course);
      
      bootstrap.Modal.getInstance(document.getElementById('dynamicModal')).hide();
      await this.loadCourseManagement();
      
      UI.showNotification('Cập nhật học phần thành công!', 'success');
      
    } catch (error) {
      console.error('Error updating course:', error);
      UI.showNotification('Lỗi khi cập nhật học phần: ' + error.message, 'danger');
    }
  },

  async deleteCourse(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa học phần này?')) {
      return;
    }

    try {
      await API.deleteCourse(id);
      await this.loadCourseManagement();
      UI.showNotification('Xóa học phần thành công!', 'success');
    } catch (error) {
      console.error('Error deleting course:', error);
      UI.showNotification('Lỗi khi xóa học phần: ' + error.message, 'danger');
    }
  },

  // Assessment Groups Management
  async loadAssessmentGroupsManagement() {
    UI.showPage('assessment-groups-management');
    
    try {
      Utils.showLoading('assessment-groups-list');
      
      const groups = await API.getAllAssessmentGroups();
      AppState.assessmentGroups = groups;
      
      const columns = [
        { key: 'name', title: 'Tên nhóm đánh giá' },
        { key: 'course_code', title: 'Mã học phần' },
        { key: 'course_name', title: 'Tên học phần' },
        { key: 'weight', title: 'Trọng số (%)', format: value => `${(value * 100).toFixed(1)}%` },
        { key: 'description', title: 'Mô tả' }
      ];
      
      const actions = [
        { icon: 'pencil', text: 'Sửa', type: 'warning', onClick: 'Pages.editAssessmentGroup' },
        { icon: 'trash', text: 'Xóa', type: 'danger', onClick: 'Pages.deleteAssessmentGroup' }
      ];
      
      UI.createDataTable('assessment-groups-list', columns, groups, actions);
      
    } catch (error) {
      console.error('Error loading assessment groups:', error);
      UI.showNotification('Lỗi khi tải danh sách nhóm đánh giá', 'danger');
    }
  },

  showCreateAssessmentGroupModal() {
    const content = `
      <form id="create-assessment-group-form">
        <div class="mb-3">
          <label class="form-label">Học phần</label>
          <select class="form-control" name="course_id" required id="ag-course-select">
            <option value="">Chọn học phần</option>
            ${AppState.courses.map(c => `<option value="${c.id}">${c.code} - ${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Tên nhóm đánh giá</label>
          <input type="text" class="form-control" name="name" required placeholder="Ví dụ: Bài tập, Giữa kỳ, Cuối kỳ">
        </div>
        <div class="mb-3">
          <label class="form-label">Trọng số (%)</label>
          <input type="number" class="form-control" name="weight" min="1" max="100" required placeholder="10">
        </div>
        <div class="mb-3">
          <label class="form-label">Mô tả</label>
          <textarea class="form-control" name="description" rows="3" placeholder="Mô tả chi tiết về nhóm đánh giá"></textarea>
        </div>
      </form>
    `;

    UI.showModal('Tạo nhóm đánh giá mới', content, [
      {
        text: 'Tạo nhóm',
        type: 'primary',
        onClick: 'Pages.createAssessmentGroup()'
      }
    ]);
  },

  async createAssessmentGroup() {
    try {
      const form = document.getElementById('create-assessment-group-form');
      const formData = new FormData(form);
      
      const group = {
        id: Utils.generateId('AG'),
        course_id: formData.get('course_id'),
        name: formData.get('name'),
        weight: parseFloat(formData.get('weight')) / 100,
        description: formData.get('description')
      };

      await API.createAssessmentGroup(group);
      
      bootstrap.Modal.getInstance(document.getElementById('dynamicModal')).hide();
      await this.loadAssessmentGroupsManagement();
      
      UI.showNotification('Tạo nhóm đánh giá thành công!', 'success');
      
    } catch (error) {
      console.error('Error creating assessment group:', error);
      UI.showNotification('Lỗi khi tạo nhóm đánh giá: ' + error.message, 'danger');
    }
  },

  async deleteAssessmentGroup(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa nhóm đánh giá này?')) {
      return;
    }

    try {
      await API.deleteAssessmentGroup(id);
      await this.loadAssessmentGroupsManagement();
      UI.showNotification('Xóa nhóm đánh giá thành công!', 'success');
    } catch (error) {
      console.error('Error deleting assessment group:', error);
      UI.showNotification('Lỗi khi xóa nhóm đánh giá: ' + error.message, 'danger');
    }
  },

  // Questions Management
  async loadQuestionsManagement() {
    UI.showPage('questions-management');
    
    try {
      Utils.showLoading('questions-list');
      
      const questions = await API.getAllQuestions();
      AppState.questions = questions;
      
      const columns = [
        { key: 'content', title: 'Nội dung câu hỏi' },
        { key: 'assessment_group_name', title: 'Nhóm đánh giá' },
        { key: 'course_code', title: 'Học phần' },
        { key: 'max_score', title: 'Điểm tối đa' },
        { key: 'clo_code', title: 'CLO' }
      ];
      
      const actions = [
        { icon: 'pencil', text: 'Sửa', type: 'warning', onClick: 'Pages.editQuestion' },
        { icon: 'trash', text: 'Xóa', type: 'danger', onClick: 'Pages.deleteQuestion' }
      ];
      
      UI.createDataTable('questions-list', columns, questions, actions);
      
    } catch (error) {
      console.error('Error loading questions:', error);
      UI.showNotification('Lỗi khi tải danh sách câu hỏi', 'danger');
    }
  },

  showCreateQuestionModal() {
    const content = `
      <form id="create-question-form">
        <div class="mb-3">
          <label class="form-label">Nhóm đánh giá</label>
          <select class="form-control" name="assessment_group_id" required id="q-assessment-group-select">
            <option value="">Chọn nhóm đánh giá</option>
            ${AppState.assessmentGroups.map(ag => `<option value="${ag.id}">${ag.name} - ${ag.course_code}</option>`).join('')}
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Nội dung câu hỏi/tiêu chí</label>
          <textarea class="form-control" name="content" rows="3" required placeholder="Nhập nội dung câu hỏi hoặc tiêu chí đánh giá"></textarea>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Điểm tối đa</label>
              <input type="number" class="form-control" name="max_score" min="0.1" step="0.1" required placeholder="10">
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">CLO</label>
              <select class="form-control" name="clo_id" required>
                <option value="">Chọn CLO</option>
                ${AppState.clos.map(clo => `<option value="${clo.id}">${clo.code} - ${clo.description}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Ghi chú</label>
          <textarea class="form-control" name="notes" rows="2" placeholder="Ghi chú thêm về câu hỏi"></textarea>
        </div>
      </form>
    `;

    UI.showModal('Tạo câu hỏi/tiêu chí mới', content, [
      {
        text: 'Tạo câu hỏi',
        type: 'primary',
        onClick: 'Pages.createQuestion()'
      }
    ]);
  },

  async createQuestion() {
    try {
      const form = document.getElementById('create-question-form');
      const formData = new FormData(form);
      
      const question = {
        id: Utils.generateId('Q'),
        assessment_group_id: formData.get('assessment_group_id'),
        content: formData.get('content'),
        max_score: parseFloat(formData.get('max_score')),
        clo_id: formData.get('clo_id'),
        notes: formData.get('notes')
      };

      await API.createQuestion(question);
      
      bootstrap.Modal.getInstance(document.getElementById('dynamicModal')).hide();
      await this.loadQuestionsManagement();
      
      UI.showNotification('Tạo câu hỏi thành công!', 'success');
      
    } catch (error) {
      console.error('Error creating question:', error);
      UI.showNotification('Lỗi khi tạo câu hỏi: ' + error.message, 'danger');
    }
  },

  async deleteQuestion(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      return;
    }

    try {
      await API.deleteQuestion(id);
      await this.loadQuestionsManagement();
      UI.showNotification('Xóa câu hỏi thành công!', 'success');
    } catch (error) {
      console.error('Error deleting question:', error);
      UI.showNotification('Lỗi khi xóa câu hỏi: ' + error.message, 'danger');
    }
  },

  // User Management
  async loadUserManagement() {
    UI.showPage('user-management');
    
    try {
      Utils.showLoading('users-list');
      
      const [users, departments, roles] = await Promise.all([
        API.getUsers(),
        API.getDepartments(),
        API.getRoles()
      ]);
      
      AppState.users = users;
      AppState.departments = departments;
      AppState.roles = roles;
      
      // Populate filter dropdowns
      const roleFilter = document.getElementById('user-role-filter');
      roleFilter.innerHTML = '<option value="">Tất cả vai trò</option>' +
        roles.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
      
      const deptFilter = document.getElementById('user-department-filter');
      deptFilter.innerHTML = '<option value="">Tất cả khoa/bộ môn</option>' +
        departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
      
      this.renderUsersList(users);
      
    } catch (error) {
      console.error('Error loading users:', error);
      UI.showNotification('Lỗi khi tải danh sách người dùng', 'danger');
    }
  },

  renderUsersList(users) {
    const columns = [
      { key: 'username', title: 'Tên đăng nhập' },
      { key: 'full_name', title: 'Họ và tên' },
      { key: 'email', title: 'Email' },
      { key: 'role_name', title: 'Vai trò' },
      { key: 'department_name', title: 'Khoa/Bộ môn' },
      { key: 'status', title: 'Trạng thái', type: 'status' }
    ];
    
    const actions = [
      { icon: 'pencil', text: 'Sửa', type: 'warning', onClick: 'Pages.editUser' },
      { icon: 'trash', text: 'Xóa', type: 'danger', onClick: 'Pages.deleteUser' }
    ];
    
    UI.createDataTable('users-list', columns, users, actions);
  },

  filterUsers() {
    const roleFilter = document.getElementById('user-role-filter').value;
    const deptFilter = document.getElementById('user-department-filter').value;
    const searchTerm = document.getElementById('user-search').value.toLowerCase();
    
    let filteredUsers = AppState.users;
    
    if (roleFilter) {
      filteredUsers = filteredUsers.filter(u => u.role_id == roleFilter);
    }
    
    if (deptFilter) {
      filteredUsers = filteredUsers.filter(u => u.department_id == deptFilter);
    }
    
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(u => 
        u.username.toLowerCase().includes(searchTerm) ||
        u.full_name.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm)
      );
    }
    
    this.renderUsersList(filteredUsers);
  },

  showCreateUserModal() {
    const content = `
      <form id="create-user-form">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Tên đăng nhập</label>
              <input type="text" class="form-control" name="username" required>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Mật khẩu</label>
              <input type="password" class="form-control" name="password" required>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Họ và tên</label>
          <input type="text" class="form-control" name="full_name" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" name="email" required>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Vai trò</label>
              <select class="form-control" name="role_id" required>
                <option value="">Chọn vai trò</option>
                ${AppState.roles.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Khoa/Bộ môn</label>
              <select class="form-control" name="department_id" required>
                <option value="">Chọn khoa/bộ môn</option>
                ${AppState.departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
      </form>
    `;

    UI.showModal('Tạo người dùng mới', content, [
      {
        text: 'Tạo người dùng',
        type: 'primary',
        onClick: 'Pages.createUser()'
      }
    ]);
  },

  async createUser() {
    try {
      const form = document.getElementById('create-user-form');
      const formData = new FormData(form);
      
      const user = {
        username: formData.get('username'),
        password: formData.get('password'),
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        role_id: formData.get('role_id'),
        department_id: formData.get('department_id'),
        status: 'active'
      };

      await API.createUser(user);
      
      bootstrap.Modal.getInstance(document.getElementById('dynamicModal')).hide();
      await this.loadUserManagement();
      
      UI.showNotification('Tạo người dùng thành công!', 'success');
      
    } catch (error) {
      console.error('Error creating user:', error);
      UI.showNotification('Lỗi khi tạo người dùng: ' + error.message, 'danger');
    }
  },

  async deleteUser(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      await API.deleteUser(id);
      await this.loadUserManagement();
      UI.showNotification('Xóa người dùng thành công!', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      UI.showNotification('Lỗi khi xóa người dùng: ' + error.message, 'danger');
    }
  },

  // Department Management
  async loadDepartmentManagement() {
    UI.showPage('department-management');
    
    try {
      Utils.showLoading('departments-list');
      
      const departments = await API.getDepartments();
      AppState.departments = departments;
      
      const columns = [
        { key: 'code', title: 'Mã khoa/bộ môn' },
        { key: 'name', title: 'Tên khoa/bộ môn' },
        { key: 'description', title: 'Mô tả' },
        { key: 'head_name', title: 'Trưởng khoa/bộ môn' },
        { key: 'status', title: 'Trạng thái', type: 'status' }
      ];
      
      const actions = [
        { icon: 'pencil', text: 'Sửa', type: 'warning', onClick: 'Pages.editDepartment' },
        { icon: 'trash', text: 'Xóa', type: 'danger', onClick: 'Pages.deleteDepartment' }
      ];
      
      UI.createDataTable('departments-list', columns, departments, actions);
      
    } catch (error) {
      console.error('Error loading departments:', error);
      UI.showNotification('Lỗi khi tải danh sách khoa/bộ môn', 'danger');
    }
  },

  showCreateDepartmentModal() {
    const content = `
      <form id="create-department-form">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Mã khoa/bộ môn</label>
              <input type="text" class="form-control" name="code" required placeholder="Ví dụ: MECH, IT, CIVIL">
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Trưởng khoa/bộ môn</label>
              <select class="form-control" name="head_id">
                <option value="">Chọn trưởng khoa</option>
                ${AppState.users.filter(u => u.role_name === 'Giảng viên' || u.role_name === 'Trưởng khoa').map(u => `<option value="${u.id}">${u.full_name}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Tên khoa/bộ môn</label>
          <input type="text" class="form-control" name="name" required placeholder="Ví dụ: Khoa Cơ khí">
        </div>
        <div class="mb-3">
          <label class="form-label">Mô tả</label>
          <textarea class="form-control" name="description" rows="3" placeholder="Mô tả về khoa/bộ môn"></textarea>
        </div>
      </form>
    `;

    UI.showModal('Tạo khoa/bộ môn mới', content, [
      {
        text: 'Tạo khoa/bộ môn',
        type: 'primary',
        onClick: 'Pages.createDepartment()'
      }
    ]);
  },

  async createDepartment() {
    try {
      const form = document.getElementById('create-department-form');
      const formData = new FormData(form);
      
      const department = {
        code: formData.get('code'),
        name: formData.get('name'),
        description: formData.get('description'),
        head_id: formData.get('head_id') || null,
        status: 'active'
      };

      await API.createDepartment(department);
      
      bootstrap.Modal.getInstance(document.getElementById('dynamicModal')).hide();
      await this.loadDepartmentManagement();
      
      UI.showNotification('Tạo khoa/bộ môn thành công!', 'success');
      
    } catch (error) {
      console.error('Error creating department:', error);
      UI.showNotification('Lỗi khi tạo khoa/bộ môn: ' + error.message, 'danger');
    }
  },

  async deleteDepartment(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa khoa/bộ môn này?')) {
      return;
    }

    try {
      await API.deleteDepartment(id);
      await this.loadDepartmentManagement();
      UI.showNotification('Xóa khoa/bộ môn thành công!', 'success');
    } catch (error) {
      console.error('Error deleting department:', error);
      UI.showNotification('Lỗi khi xóa khoa/bộ môn: ' + error.message, 'danger');
    }
  },

  // Score Management
  async loadScoreManagement() {
    UI.showPage('scores');
    
    try {
      // Load classes for score entry
      const classes = await API.getClasses();
      const classSelect = document.getElementById('score-class-select');
      
      classSelect.innerHTML = '<option value="">Chọn lớp học</option>' +
        classes.map(c => `<option value="${c.id}">${c.course_code} - ${c.name} (${c.semester})</option>`).join('');
      
    } catch (error) {
      console.error('Error loading score management:', error);
    }
  },

  async handleBulkUpload() {
    const fileInput = document.getElementById('bulk-upload-file');
    const file = fileInput.files[0];
    
    if (!file) {
      UI.showNotification('Vui lòng chọn file để tải lên', 'warning');
      return;
    }
    
    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      UI.showNotification('Chỉ chấp nhận file Excel (.xlsx, .xls) hoặc CSV', 'warning');
      return;
    }
    
    try {
      const uploadBtn = document.getElementById('upload-scores-btn');
      uploadBtn.disabled = true;
      uploadBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang tải lên...';
      
      const result = await API.bulkUploadScores(file);
      
      if (result.success) {
        UI.showNotification(`Tải lên thành công! Đã xử lý ${result.processedCount} điểm`, 'success');
        
        // Show upload results
        if (result.errors && result.errors.length > 0) {
          const errorsList = result.errors.map(err => `<li>Dòng ${err.row}: ${err.message}</li>`).join('');
          const alertHtml = `
            <div class="alert alert-warning mt-3">
              <h6>Một số lỗi đã xảy ra:</h6>
              <ul class="mb-0">${errorsList}</ul>
            </div>
          `;
          document.getElementById('upload-results').innerHTML = alertHtml;
        }
        
        // Clear file input
        fileInput.value = '';
      } else {
        throw new Error(result.error || 'Upload failed');
      }
      
    } catch (error) {
      console.error('Error uploading scores:', error);
      UI.showNotification('Lỗi khi tải lên điểm: ' + error.message, 'danger');
    } finally {
      const uploadBtn = document.getElementById('upload-scores-btn');
      uploadBtn.disabled = false;
      uploadBtn.innerHTML = 'Tải lên điểm';
    }
  },

  // Reports
  async loadCLOReports() {
    UI.showPage('clo-reports');
    
    try {
      // Load courses for report generation
      const allCourses = [];
      for (const program of AppState.programs) {
        const courses = await API.getCourses(program.id);
        allCourses.push(...courses);
      }
      
      const courseSelect = document.getElementById('clo-report-course-select');
      courseSelect.innerHTML = '<option value="">Chọn học phần</option>' +
        allCourses.map(c => `<option value="${c.id}">${c.code} - ${c.name}</option>`).join('');
      
    } catch (error) {
      console.error('Error loading CLO reports:', error);
    }
  },

  async loadPLOReports() {
    UI.showPage('plo-reports');
    
    // The programs are already loaded in AppState
    const programSelect = document.getElementById('plo-report-program-select');
    programSelect.innerHTML = '<option value="">Chọn chương trình</option>' +
      AppState.programs.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  },

  // Modal handlers for creating/editing entities
  showCreatePLOModal() {
    const programSelect = document.getElementById('plo-program-select');
    const programId = programSelect.value;
    
    if (!programId) {
      UI.showNotification('Vui lòng chọn chương trình đào tạo trước', 'warning');
      return;
    }

    const content = `
      <form id="create-plo-form">
        <div class="mb-3">
          <label class="form-label">Mã PLO</label>
          <input type="text" class="form-control" name="code" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Mô tả</label>
          <textarea class="form-control" name="description" rows="3" required></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Mức độ Bloom</label>
          <select class="form-control" name="bloom_level" required>
            <option value="">Chọn mức độ</option>
            <option value="Remember">Remember</option>
            <option value="Understand">Understand</option>
            <option value="Apply">Apply</option>
            <option value="Analyze">Analyze</option>
            <option value="Evaluate">Evaluate</option>
            <option value="Create">Create</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Phân loại</label>
          <select class="form-control" name="category" required>
            <option value="">Chọn phân loại</option>
            <option value="Knowledge">Kiến thức</option>
            <option value="Skills">Kỹ năng</option>
            <option value="Attitude">Thái độ</option>
          </select>
        </div>
      </form>
    `;

    UI.showModal('Tạo PLO mới', content, [
      {
        text: 'Tạo PLO',
        type: 'primary',
        onClick: 'Pages.createPLO()'
      }
    ]);
  },

  async createPLO() {
    try {
      const form = document.getElementById('create-plo-form');
      const formData = new FormData(form);
      
      const programSelect = document.getElementById('plo-program-select');
      const programId = programSelect.value;
      
      const plo = {
        id: Utils.generateId('PLO'),
        program_id: programId,
        code: formData.get('code'),
        description: formData.get('description'),
        bloom_level: formData.get('bloom_level'),
        category: formData.get('category'),
        status: 'active'
      };

      await API.createPLO(plo);
      
      bootstrap.Modal.getInstance(document.getElementById('dynamicModal')).hide();
      await this.loadPLOManagement();
      
      UI.showNotification('Tạo PLO thành công!', 'success');
      
    } catch (error) {
      console.error('Error creating PLO:', error);
      UI.showNotification('Lỗi khi tạo PLO: ' + error.message, 'danger');
    }
  },

  showCreateCourseModal() {
    const programSelect = document.getElementById('course-program-select');
    const programId = programSelect.value;
    
    if (!programId) {
      UI.showNotification('Vui lòng chọn chương trình đào tạo trước', 'warning');
      return;
    }

    const content = `
      <form id="create-course-form">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Mã học phần</label>
              <input type="text" class="form-control" name="code" required>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Số tín chỉ</label>
              <input type="number" class="form-control" name="credits" min="1" max="10" required>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Tên học phần</label>
          <input type="text" class="form-control" name="name" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Mô tả</label>
          <textarea class="form-control" name="description" rows="3"></textarea>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Học phần tiên quyết</label>
              <input type="text" class="form-control" name="prerequisites" placeholder="Ví dụ: MATH101, PHYS101">
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Học kỳ</label>
              <select class="form-control" name="semester" required>
                <option value="">Chọn học kỳ</option>
                <option value="1">Học kỳ 1</option>
                <option value="2">Học kỳ 2</option>
                <option value="3">Học kỳ 3</option>
                <option value="4">Học kỳ 4</option>
                <option value="5">Học kỳ 5</option>
                <option value="6">Học kỳ 6</option>
                <option value="7">Học kỳ 7</option>
                <option value="8">Học kỳ 8</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    `;

    UI.showModal('Tạo học phần mới', content, [
      {
        text: 'Tạo học phần',
        type: 'primary',
        onClick: 'Pages.createCourse()'
      }
    ]);
  },

  async createCourse() {
    try {
      const form = document.getElementById('create-course-form');
      const formData = new FormData(form);
      
      const programSelect = document.getElementById('course-program-select');
      const programId = programSelect.value;
      
      const course = {
        id: Utils.generateId('COURSE'),
        program_id: programId,
        code: formData.get('code'),
        name: formData.get('name'),
        credits: parseInt(formData.get('credits')),
        description: formData.get('description'),
        prerequisites: formData.get('prerequisites'),
        semester: parseInt(formData.get('semester')),
        status: 'active'
      };

      await API.createCourse(course);
      
      bootstrap.Modal.getInstance(document.getElementById('dynamicModal')).hide();
      await this.loadCourseManagement();
      
      UI.showNotification('Tạo học phần thành công!', 'success');
      
    } catch (error) {
      console.error('Error creating course:', error);
      UI.showNotification('Lỗi khi tạo học phần: ' + error.message, 'danger');
    }
  },

  // Generate CLO Report
  async generateCLOReport() {
    try {
      const courseSelect = document.getElementById('clo-report-course-select');
      const classSelect = document.getElementById('clo-report-class-select');
      
      const courseId = courseSelect.value;
      const classId = classSelect.value;
      
      if (!courseId || !classId) {
        UI.showNotification('Vui lòng chọn đầy đủ thông tin', 'warning');
        return;
      }
      
      const generateBtn = document.getElementById('generate-clo-report-btn');
      generateBtn.disabled = true;
      generateBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang tạo báo cáo...';
      
      const report = await API.generateCLOReport(courseId, classId);
      
      this.displayCLOReport(report);
      
      UI.showNotification('Tạo báo cáo CLO thành công!', 'success');
      
    } catch (error) {
      console.error('Error generating CLO report:', error);
      UI.showNotification('Lỗi khi tạo báo cáo CLO: ' + error.message, 'danger');
    } finally {
      const generateBtn = document.getElementById('generate-clo-report-btn');
      generateBtn.disabled = false;
      generateBtn.innerHTML = 'Tạo báo cáo';
    }
  },

  displayCLOReport(report) {
    const container = document.getElementById('clo-report-results');
    
    const chartData = {
      labels: report.clo_results.map(r => r.clo_code),
      datasets: [{
        label: 'Tỷ lệ đạt (%)',
        data: report.clo_results.map(r => r.pass_rate * 100),
        backgroundColor: CONFIG.CHART_COLORS,
        borderColor: CONFIG.CHART_COLORS,
        borderWidth: 1
      }]
    };
    
    const resultHtml = `
      <div class="card">
        <div class="card-header">
          <h5>Báo cáo đánh giá CLO - ${Utils.formatDate(report.report_date)}</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-8">
              <canvas id="clo-chart" height="300"></canvas>
            </div>
            <div class="col-md-4">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>CLO</th>
                    <th>Tỷ lệ đạt</th>
                    <th>Điểm TB</th>
                  </tr>
                </thead>
                <tbody>
                  ${report.clo_results.map(r => `
                    <tr>
                      <td>${r.clo_code}</td>
                      <td>${Utils.formatPercent(r.pass_rate)}</td>
                      <td>${Utils.formatScore(r.average_score)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          <div class="mt-3">
            <button class="btn btn-success" onclick="Utils.exportToCSV(${JSON.stringify(report.clo_results)}, 'clo-report-${report.report_date}.csv')">
              <i class="bi bi-download"></i> Xuất CSV
            </button>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = resultHtml;
    
    // Create chart
    setTimeout(() => {
      UI.createChart('clo-chart', 'bar', chartData, {
        plugins: {
          title: {
            display: true,
            text: 'Tỷ lệ đạt CLO theo từng chuẩn đầu ra'
          }
        },
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
        }
      });
    }, 100);
  }
};

// Initialize application
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 EAUT Assessment Platform Frontend Initialized');

  // Check authentication on load
  Auth.checkAuthOnLoad();

  // Setup event listeners
  setupEventListeners();
});

function setupEventListeners() {
  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await Auth.login();
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.logout();
    });
  }

  // Navigation links
  document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
      e.preventDefault();
      const page = e.target.getAttribute('href').substring(1);
      
      // Route to appropriate page loader
      switch (page) {
        case 'dashboard':
          Pages.loadDashboard();
          break;
        case 'introduction':
          UI.showPage('introduction');
          break;
        case 'plo-management':
          Pages.loadPLOManagement();
          break;
        case 'course-management':  
          Pages.loadCourseManagement();
          break;
        case 'assessment-groups-management':
          Pages.loadAssessmentGroupsManagement();
          break;
        case 'questions-management':
          Pages.loadQuestionsManagement();
          break;
        case 'user-management':
          Pages.loadUserManagement();
          break;
        case 'department-management':
          Pages.loadDepartmentManagement();
          break;
        case 'scores':
          Pages.loadScoreManagement();
          break;
        case 'clo-reports':
          Pages.loadCLOReports();
          break;
        case 'plo-reports':
          Pages.loadPLOReports();
          break;
        default:
          UI.showPage(page);
      }
    }
  });

  // Program selection changes
  document.addEventListener('change', (e) => {
    if (e.target.id === 'plo-program-select') {
      Pages.loadPLOManagement();
    } else if (e.target.id === 'course-program-select') {
      Pages.loadCourseManagement();
    }
  });

  // Filter events for user management
  document.addEventListener('change', (e) => {
    if (e.target.id === 'user-role-filter' || e.target.id === 'user-department-filter') {
      Pages.filterUsers();
    }
  });

  // Search events
  document.addEventListener('input', (e) => {
    if (e.target.id === 'user-search') {
      Pages.filterUsers();
    }
  });
}

// Global functions for inline onclick handlers
window.Pages = Pages;
window.Auth = Auth;
window.UI = UI;
window.Utils = Utils;
