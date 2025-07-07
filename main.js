function navigateToSection(section) {
    // Hiệu ứng click
    event.target.closest('.card').style.transform = 'scale(0.95)';
    setTimeout(() => {
        event.target.closest('.card').style.transform = '';
    }, 150);
    
    // Thông báo điều hướng
    //alert(`Đang chuyển đến: ${section}`);
    
    // Ở đây bạn có thể thêm logic điều hướng thực tế
    // window.location.href = `/${section}`;
}

function openSupport() {
    document.getElementById('supportPopup').style.display = 'block';
}
function closeSupport() {
    document.getElementById('supportPopup').style.display = 'none';
}

// Hiệu ứng hover và click cho sidebar + điều hướng
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        // Điều hướng section nếu có data-section
        const section = this.getAttribute('data-section');
        if (section) navigateToSection(section);
    });
});

// Hiệu ứng load trang
window.addEventListener('load', function() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Popup logic
const popupOverlay = document.getElementById('popupOverlay');
const loginPopup = document.getElementById('loginPopup');
const registerPopup = document.getElementById('registerPopup');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const userProfile = document.getElementById('userProfile');
const userAvatar = document.getElementById('userAvatar');
const userInfo = document.getElementById('userInfo');


// Định nghĩa cấu trúc dữ liệu người dùng
/**
 * @typedef {Object} User
 * @property {string} username - Tên đăng nhập
 * @property {string} password - Mật khẩu
 * @property {string} email - Email
 * @property {string} role - Chức vụ (Giáo viên, Học sinh, Admin)
 * @property {string} [fullname] - Họ tên (tùy chọn)
 * @property {string} [avatar] - Đường dẫn avatar (tùy chọn)
 * @property {string} [createdAt] - Ngày tạo tài khoản (tùy chọn)
 * @property {boolean} [isActive] - Trạng thái hoạt động (tùy chọn)
 */

// Danh sách người dùng mẫu
/** @type {User[]} */
let users = [
    {
        username: 'hoang',
        password: '123456',
        email: 'hoang@gmail.com',
        role: 'Giáo viên',
        fullname: 'Nguyễn Văn Hoàng',
        avatar: '',
        createdAt: '2024-06-01T10:00:00Z',
        isActive: true
    }
];

// Thêm tài khoản admin mặc định nếu chưa có
(function ensureDefaultAdmin() {
    const hasAdmin = users.some(u => u.username === 'admin' && u.role === 'Admin');
    if (!hasAdmin) {
        users.push({
            username: 'admin',
            password: 'hoangnguyen207',
            email: 'nvhuyhoang24107@gmail.com',
            role: 'Admin',
            fullname: 'Admin',
            avatar: '',
            createdAt: new Date().toISOString(),
            isActive: true
        });
    }
})();

function openPopup(type) {
    popupOverlay.classList.add('active');
    if (type === 'login') {
        loginPopup.style.display = '';
        registerPopup.style.display = 'none';
        document.getElementById('loginError').textContent = '';
    } else {
        loginPopup.style.display = 'none';
        registerPopup.style.display = '';
        document.getElementById('registerError').textContent = '';
    }
}
function closePopup() {
    popupOverlay.classList.remove('active');
}
function switchToRegister() {
    openPopup('register');
}
function switchToLogin() {
    openPopup('login');
}
loginBtn.onclick = function(e) {
    e.preventDefault();
    openPopup('login');
};
registerBtn.onclick = function(e) {
    e.preventDefault();
    openPopup('register');
};

// Lưu thông tin đăng nhập vào localStorage
function saveLoginSession(user) {
    if (!user) return;
    // Chỉ lưu các trường cơ bản, không lưu mật khẩu
    const { username, email, role, fullname, avatar } = user;
    localStorage.setItem('heromi_user', JSON.stringify({ username, email, role, fullname, avatar }));
}

// Xóa thông tin đăng nhập khỏi localStorage
function clearLoginSession() {
    localStorage.removeItem('heromi_user');
}

// Đọc thông tin đăng nhập từ localStorage
function loadLoginSession() {
    try {
        const data = localStorage.getItem('heromi_user');
        if (!data) return null;
        return JSON.parse(data);
    } catch {
        return null;
    }
}

// Đăng nhập
async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;
    const errorDiv = document.getElementById('loginError');

    // Nếu đăng nhập là admin thì chỉ cho phép đúng tài khoản admin, không cần chọn chức vụ
    if (username === 'admin') {
        const user = users.find(u => u.username === 'admin' && u.password === password && u.role === 'Admin');
        if (user) {
            currentUser = user;
            saveLoginSession(user);
            closePopup();
            showUserProfile();
        } else {
            errorDiv.textContent = 'Tên đăng nhập, mật khẩu hoặc chức vụ không đúng!';
        }
        return false;
    }

    // Đăng nhập với Firebase nếu có hàm
    if (typeof signInWithEmailAndPassword === "function") {
        // Tìm email theo username nếu có
        let email = username;
        const userObj = users.find(u => u.username === username && u.role === role);
        if (userObj && userObj.email) email = userObj.email;
        const result = await firebaseLogin(email, password);
        if (!result.success) {
            errorDiv.textContent = result.error || 'Đăng nhập thất bại!';
            return false;
        }
        // Có thể lấy thêm thông tin user từ Firestore nếu muốn
        // Lưu session cho Firebase user
        saveLoginSession({ username: email, email: email, role: role });
    }

    // Người dùng thường (local)
    const user = users.find(u => u.username === username && u.password === password && u.role === role && u.role !== 'Admin');
    if (user) {
        currentUser = user;
        saveLoginSession(user);
        closePopup();
        showUserProfile();
    } else {
        errorDiv.textContent = 'Tên đăng nhập, mật khẩu hoặc chức vụ không đúng!';
    }
    return false;
}

// Thêm import Firebase (chỉ dùng khi chạy với bundler hoặc module, nếu dùng CDN thì bỏ qua dòng này)
// import { signInWithEmailAndPassword } from "firebase/auth";

// Hàm đăng nhập với Firebase Auth
async function firebaseLogin(email, password) {
    try {
        // Đăng nhập với Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Đọc thông tin từ Realtime Database nếu có hàm get/child/ref
        if (typeof get === "function" && typeof child === "function" && typeof ref === "function" && typeof db !== "undefined" && db.constructor.name === "Database") {
            const userRef = ref(db);
            const snapshot = await get(child(userRef, `users/${user.uid}`));
            if (snapshot.exists()) {
                const userData = snapshot.val();
                console.log("Thông tin người dùng:", userData);
            } else {
                console.log("Không tìm thấy dữ liệu người dùng");
            }
        }
        console.log("Đăng nhập thành công", user.email);
        return { success: true, user };
    } catch (error) {
        console.error("Lỗi đăng nhập:", error.message);
        return { success: false, error: error.message };
    }
}

// Thêm import Firebase (chỉ dùng khi chạy với bundler hoặc module, nếu dùng CDN thì bỏ qua dòng này)
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { setDoc, doc } from "firebase/firestore";

// Hàm đăng ký tài khoản với Firebase Auth + Firestore + Realtime Database
async function firebaseRegister(email, password, role = "user") {
    try {
        // Đăng ký với Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Lưu thêm dữ liệu vào Firestore (nếu muốn)
        if (typeof setDoc === "function" && typeof doc === "function" && typeof db !== "undefined" && db.constructor.name !== "Database") {
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: new Date(),
                role: role
            });
        }
        // Lưu vào Realtime Database nếu có hàm set/ref
        if (typeof set === "function" && typeof ref === "function" && typeof db !== "undefined" && db.constructor.name === "Database") {
            await set(ref(db, 'users/' + user.uid), {
                email: user.email,
                createdAt: new Date().toISOString(),
                role: role
            });
        }
        console.log("Đăng ký thành công");
        return { success: true, user };
    } catch (error) {
        console.error("Lỗi đăng ký:", error.message);
        return { success: false, error: error.message };
    }
}

// Đăng ký
async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const password2 = document.getElementById('registerPassword2').value;
    const role = document.getElementById('registerRole').value;
    const errorDiv = document.getElementById('registerError');
    if (password !== password2) {
        errorDiv.textContent = 'Mật khẩu không khớp!';
        return false;
    }
    if (!role) {
        errorDiv.textContent = 'Vui lòng chọn chức vụ!';
        return false;
    }
    if (username === 'admin') {
        errorDiv.textContent = 'Không thể đăng ký tài khoản admin!';
        return false;
    }
    if (users.some(u => u.username === username && u.role === role)) {
        errorDiv.textContent = 'Tên đăng nhập đã tồn tại cho chức vụ này!';
        return false;
    }

    // Đăng ký với Firebase (ưu tiên lưu cả vào Realtime Database nếu có)
    if (typeof createUserWithEmailAndPassword === "function") {
        const result = await firebaseRegister(email, password, role);
        if (!result.success) {
            errorDiv.textContent = result.error || 'Đăng ký thất bại!';
            return false;
        }
        // Có thể lưu thêm thông tin username, role vào Firestore hoặc Realtime Database nếu muốn
    }

    users.push({ username, password, email, role });
    errorDiv.textContent = '';
    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    switchToLogin();
    return false;
}

// Lưu lịch sử làm bài/tạo bài cho từng user (demo dữ liệu mẫu)
let userHistories = {
    // username: { type: 'student'|'teacher', history: [...] }
    'hoang': {
        type: 'teacher',
        history: [
            'Tạo bài tập: Toán lớp 6 - 01/06/2024',
            'Tạo bài tập: Vật lý lớp 7 - 03/06/2024'
        ]
    },
    'student1': {
        type: 'student',
        history: [
            'Làm bài: Toán lớp 6 - 02/06/2024',
            'Làm bài: Vật lý lớp 7 - 04/06/2024'
        ]
    }
};

// Thanh tìm kiếm trên dashboard
function handleSearch(event) {
    event.preventDefault();
    const value = document.getElementById('dashboardSearch').value.trim();
    if (value) {
        alert('Tìm kiếm: ' + value);
    }
    return false;
}

// Hiển thị thông tin user sau khi đăng nhập
function showUserProfile() {
    if (currentUser) {
        userProfile.style.display = 'flex';
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        userAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
        // Hiển thị họ tên nếu có
        const fullname = currentUser.fullname || '';
        document.getElementById('userFullname').textContent = fullname ? `(${fullname})` : '';
        // Hiển thị lịch sử làm bài/tạo bài
        let historyHtml = '';
        const userHistory = userHistories[currentUser.username];
        if (userHistory && Array.isArray(userHistory.history)) {
            if (userHistory.type === 'student') {
                historyHtml = '<b>Lịch sử làm bài:</b><ul style="margin:0 0 0 12px;padding:0">';
                userHistory.history.forEach(item => {
                    historyHtml += `<li>${item}</li>`;
                });
                historyHtml += '</ul>';
            } else if (userHistory.type === 'teacher') {
                historyHtml = '<b>Lịch sử tạo bài:</b><ul style="margin:0 0 0 12px;padding:0">';
                userHistory.history.forEach(item => {
                    historyHtml += `<li>${item}</li>`;
                });
                historyHtml += '</ul>';
            }
        } else {
            historyHtml = '';
        }
        document.getElementById('userHistory').innerHTML = historyHtml;

        if (currentUser.role === 'Admin') {
            userInfo.innerHTML = `<h3>${currentUser.username} <span style="color:#ee5a24;font-size:13px;">(Admin)</span></h3><p style="color:#ee5a24;font-weight:bold;">Quyền quản trị</p>`;
        } else {
            userInfo.innerHTML = `<h3>${currentUser.username}</h3><p>${currentUser.role}</p>`;
        }
    }
}

function togglePassword(inputId, el) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        el.textContent = "🙈";
    } else {
        input.type = "password";
        el.textContent = "👁️";
    }
}

// Đa ngôn ngữ
const translations = {
    vi: {
        login: "Đăng nhập",
        register: "Đăng ký",
        username: "Tên đăng nhập",
        password: "Mật khẩu",
        password2: "Nhập lại mật khẩu",
        email: "Email",
        role: "Chức vụ",
        selectRole: "Chọn chức vụ",
        teacher: "Giáo viên",
        student: "Học sinh",
        admin: "Admin",
        loginDesc: "Chào mừng bạn quay lại! Vui lòng đăng nhập để tiếp tục.",
        registerDesc: "Tạo tài khoản mới để sử dụng các tính năng của hệ thống.",
        roleDescLogin: "Chọn đúng chức vụ để truy cập quyền phù hợp.",
        roleDescRegister: "Chọn đúng chức vụ để đăng ký tài khoản phù hợp.",
        noAccount: "Chưa có tài khoản?",
        haveAccount: "Đã có tài khoản?",
        loginBtn: "Đăng nhập",
        registerBtn: "Đăng ký",
        // Sidebar
        sidebar_baitap: "Bài tập",
        sidebar_dethi: "Đề thi",
        sidebar_quanlylop: "Quản lý lớp",
        sidebar_quanlygv: "Quản lý giáo viên",
        sidebar_khonoidung: "Kho nội dung",
        sidebar_nganhang: "Ngân hàng câu hỏi",
        sidebar_dexuat: "Đề xuất tính năng",
        sidebar_setting: "Cài đặt",
        sidebar_qlhs: "Quản lý học sinh",
        // Dashboard
        dashboard_title: "Trang chủ",
        search_placeholder: "Tìm kiếm...",
        // Card
        card_baitap_title: "Bài tập",
        card_baitap_desc: "Quản lý và tạo bài tập cho học sinh",
        card_dethi_title: "Đề thi",
        card_dethi_desc: "Tạo và quản lý đề thi, kiểm tra",
        card_quanlylop_title: "Quản lý lớp",
        card_quanlylop_desc: "Quản lý thông tin lớp học và học sinh",
        card_quanlygv_title: "Quản lý giáo viên",
        card_quanlygv_desc: "Quản lý thông tin giáo viên",
        card_khonoidung_title: "Kho nội dung",
        card_khonoidung_desc: "Thư viện tài liệu và bài giảng",
        card_nganhang_title: "Ngân hàng câu hỏi",
        card_nganhang_desc: "Bộ sưu tập câu hỏi theo chủ đề",
        card_dexuat_title: "Đề xuất tính năng",
        card_dexuat_desc: "Gợi ý tính năng mới cho hệ thống",
        card_qlhs_title: "Quản lý học sinh",
        card_qlhs_desc: "Quản lý danh sách học sinh, tải lên từ file Excel",
        vip_badge: "VIP",
        // Hỗ trợ
        support_title: "Hỗ trợ trực tuyến",
        support_ready: "Chúng tôi luôn sẵn sàng hỗ trợ bạn!",
        support_contact: "Liên hệ qua email:",
        support_feedback: "Hoặc gửi phản hồi, góp ý về hệ thống để chúng tôi phục vụ bạn tốt hơn.",
        // Ngân hàng câu hỏi
        nhch_title: "Ngân hàng câu hỏi",
        nhch_desc: "Bạn có thể xem, tải về hoặc sử dụng các đề thi/bài tập được chia sẻ công khai bởi người dùng khác.",
        nhch_empty: "Chưa có đề thi hoặc bài tập nào được chia sẻ công khai.",
        nhch_author: "Tác giả",
        nhch_date: "Ngày đăng",
        nhch_download: "Xem/Tải về",
        nhch_use: "Sử dụng",
        exercise: "Bài tập",
        exam: "Đề thi",
        // Setting
        setting_title: "Cài đặt tài khoản",
        setting_login_required: "Vui lòng đăng nhập để sử dụng chức năng cài đặt tài khoản.",
        setting_avatar: "Ảnh đại diện",
        setting_fullname: "Họ tên",
        setting_fullname_placeholder: "Nhập họ tên",
        setting_email: "Email",
        setting_email_placeholder: "Nhập email",
        setting_update_btn: "Cập nhật thông tin",
        setting_role: "Chức vụ",
        setting_created_ex: "Số bài tập đã tạo",
        setting_created_exam: "Số đề thi đã tạo",
        setting_done_ex: "Số bài tập đã làm",
        setting_done_exam: "Số đề thi đã làm",
        setting_achievements: "Thành tựu",
        setting_logout: "Đăng xuất",
        setting_delete: "Yêu cầu xóa tài khoản",
    },
    en: {
        login: "Login",
        register: "Register",
        username: "Username",
        password: "Password",
        password2: "Confirm Password",
        email: "Email",
        role: "Role",
        selectRole: "Select role",
        teacher: "Teacher",
        student: "Student",
        admin: "Admin",
        loginDesc: "Welcome back! Please login to continue.",
        registerDesc: "Create a new account to use the system features.",
        roleDescLogin: "Select the correct role to access appropriate permissions.",
        roleDescRegister: "Select the correct role to register the right account.",
        noAccount: "Don't have an account?",
        haveAccount: "Already have an account?",
        loginBtn: "Login",
        registerBtn: "Register",
        // Sidebar
        sidebar_baitap: "Exercises",
        sidebar_dethi: "Exams",
        sidebar_quanlylop: "Class Management",
        sidebar_quanlygv: "Teacher Management",
        sidebar_khonoidung: "Content Library",
        sidebar_nganhang: "Question Bank",
        sidebar_dexuat: "Feature Suggestion",
        sidebar_setting: "Settings",
        sidebar_qlhs: "Student Management",
        // Dashboard
        dashboard_title: "Dashboard",
        search_placeholder: "Search...",
        // Card
        card_baitap_title: "Exercises",
        card_baitap_desc: "Manage and create exercises for students",
        card_dethi_title: "Exams",
        card_dethi_desc: "Create and manage exams, tests",
        card_quanlylop_title: "Class Management",
        card_quanlylop_desc: "Manage class and student information",
        card_quanlygv_title: "Teacher Management",
        card_quanlygv_desc: "Manage teacher information",
        card_khonoidung_title: "Content Library",
        card_khonoidung_desc: "Library of documents and lectures",
        card_nganhang_title: "Question Bank",
        card_nganhang_desc: "Collection of topic-based questions",
        card_dexuat_title: "Feature Suggestion",
        card_dexuat_desc: "Suggest new features for the system",
        card_qlhs_title: "Student Management",
        card_qlhs_desc: "Manage student list, upload from Excel file",
        vip_badge: "VIP",
        // Hỗ trợ
        support_title: "Online Support",
        support_ready: "We are always ready to support you!",
        support_contact: "Contact via email:",
        support_feedback: "Or send feedback and suggestions so we can serve you better.",
        // Question Bank
        nhch_title: "Question Bank",
        nhch_desc: "You can view, download or use public exams/exercises shared by other users.",
        nhch_empty: "No public exams or exercises have been shared yet.",
        nhch_author: "Author",
        nhch_date: "Date",
        nhch_download: "View/Download",
        nhch_use: "Use",
        exercise: "Exercise",
        exam: "Exam",
        // Setting
        setting_title: "Account Settings",
        setting_login_required: "Please log in to use account settings.",
        setting_avatar: "Avatar",
        setting_fullname: "Full name",
        setting_fullname_placeholder: "Enter full name",
        setting_email: "Email",
        setting_email_placeholder: "Enter email",
        setting_update_btn: "Update information",
        setting_role: "Role",
        setting_created_ex: "Exercises created",
        setting_created_exam: "Exams created",
        setting_done_ex: "Exercises done",
        setting_done_exam: "Exams done",
        setting_achievements: "Achievements",
        setting_logout: "Logout",
        setting_delete: "Request account deletion",
    },
    zh: {
        login: "登录",
        register: "注册",
        username: "用户名",
        password: "密码",
        password2: "确认密码",
        email: "邮箱",
        role: "角色",
        selectRole: "选择角色",
        teacher: "老师",
        student: "学生",
        admin: "管理员",
        loginDesc: "欢迎回来！请登录以继续。",
        registerDesc: "创建新账户以使用系统功能。",
        roleDescLogin: "请选择正确的角色以获得相应权限。",
        roleDescRegister: "请选择正确的角色以注册合适的账户。",
        noAccount: "还没有账户？",
        haveAccount: "已有账户？",
        loginBtn: "登录",
        registerBtn: "注册",
        // Sidebar
        sidebar_baitap: "练习",
        sidebar_dethi: "考试",
        sidebar_quanlylop: "班级管理",
        sidebar_quanlygv: "教师管理",
        sidebar_khonoidung: "内容库",
        sidebar_nganhang: "题库",
        sidebar_dexuat: "功能建议",
        sidebar_setting: "设置",
        sidebar_qlhs: "学生管理",
        // Dashboard
        dashboard_title: "仪表板",
        search_placeholder: "搜索...",
        // Card
        card_baitap_title: "练习",
        card_baitap_desc: "管理和创建学生练习",
        card_dethi_title: "考试",
        card_dethi_desc: "创建和管理考试、测试",
        card_quanlylop_title: "班级管理",
        card_quanlylop_desc: "管理班级和学生信息",
        card_quanlygv_title: "教师管理",
        card_quanlygv_desc: "管理教师信息",
        card_khonoidung_title: "内容库",
        card_khonoidung_desc: "文档和讲座库",
        card_nganhang_title: "题库",
        card_nganhang_desc: "基于主题的问题集合",
        card_dexuat_title: "功能建议",
        card_dexuat_desc: "为系统建议新功能",
        card_qlhs_title: "学生管理",
        card_qlhs_desc: "管理学生名单，从Excel文件上传",
        vip_badge: "VIP",
        // Hỗ trợ
        support_title: "在线支持",
        support_ready: "我们随时为您提供支持！",
        support_contact: "通过邮箱联系：",
        support_feedback: "或发送反馈和建议，以便我们更好地为您服务。",
        // Question Bank
        nhch_title: "题库",
        nhch_desc: "您可以查看、下载或使用其他用户共享的公共考试/练习题。",
        nhch_empty: "尚未共享任何公共考试或练习题。",
        nhch_author: "作者",
        nhch_date: "日期",
        nhch_download: "查看/下载",
        nhch_use: "使用",
        exercise: "练习",
        exam: "考试",
        // Setting
        setting_title: "账户设置",
        setting_login_required: "请登录以使用账户设置功能。",
        setting_avatar: "头像",
        setting_fullname: "姓名",
        setting_fullname_placeholder: "输入姓名",
        setting_email: "电子邮件",
        setting_email_placeholder: "输入电子邮件",
        setting_update_btn: "更新信息",
        setting_role: "角色",
        setting_created_ex: "创建的练习",
        setting_created_exam: "创建的考试",
        setting_done_ex: "完成的练习",
        setting_done_exam: "完成的考试",
        setting_achievements: "成就",
        setting_logout: "登出",
        setting_delete: "请求删除账户",
    },
    ja: {
        login: "ログイン",
        register: "登録",
        username: "ユーザー名",
        password: "パスワード",
        password2: "パスワード再入力",
        email: "メール",
        role: "役割",
        selectRole: "役割を選択",
        teacher: "教師",
        student: "生徒",
        admin: "管理者",
        loginDesc: "お帰りなさい！続行するにはログインしてください。",
        registerDesc: "新しいアカウントを作成してシステム機能を利用しましょう。",
        roleDescLogin: "適切な権限を得るため正しい役割を選択してください。",
        roleDescRegister: "正しい役割を選択してアカウントを登録してください。",
        noAccount: "アカウントをお持ちでないですか？",
        haveAccount: "すでにアカウントをお持ちですか？",
        loginBtn: "ログイン",
        registerBtn: "登録",
        // Sidebar
        sidebar_baitap: "演習",
        sidebar_dethi: "試験",
        sidebar_quanlylop: "クラス管理",
        sidebar_quanlygv: "教師管理",
        sidebar_khonoidung: "コンテンツライブラリ",
        sidebar_nganhang: "問題バンク",
        sidebar_dexuat: "機能提案",
        sidebar_setting: "設定",
        sidebar_qlhs: "生徒管理",
        // Dashboard
        dashboard_title: "ダッシュボード",
        search_placeholder: "検索...",
        // Card
        card_baitap_title: "演習",
        card_baitap_desc: "学生のための演習を管理および作成する",
        card_dethi_title: "試験",
        card_dethi_desc: "試験やテストを作成および管理する",
        card_quanlylop_title: "クラス管理",
        card_quanlylop_desc: "クラスや生徒の情報を管理する",
        card_quanlygv_title: "教師管理",
        card_quanlygv_desc: "教師の情報を管理する",
        card_khonoidung_title: "コンテンツライブラリ",
        card_khonoidung_desc: "文書や講義のライブラリ",
        card_nganhang_title: "問題バンク",
        card_nganhang_desc: "トピックベースの質問のコレクション",
        card_dexuat_title: "機能提案",
        card_dexuat_desc: "システムの新機能を提案する",
        card_qlhs_title: "生徒管理",
        card_qlhs_desc: "生徒リストの管理、Excelファイルからアップロード",
        vip_badge: "VIP",
        // Hỗ trợ
        support_title: "オンラインサポート",
        support_ready: "いつでもサポートいたします！",
        support_contact: "メールで連絡：",
        support_feedback: "またはご意見・ご要望をお送りください。より良いサービスを提供します。",
        // Question Bank
        nhch_title: "問題バンク",
        nhch_desc: "他のユーザーが共有した公開試験/演習を表示、ダウンロード、または使用できます。",
        nhch_empty: "まだ公開された試験や演習は共有されていません。",
        nhch_author: "著者",
        nhch_date: "日付",
        nhch_download: "表示/ダウンロード",
        nhch_use: "使用",
        exercise: "演習",
        exam: "試験",
        // Setting
        setting_title: "アカウント設定",
        setting_login_required: "アカウント設定を使用するにはログインしてください。",
        setting_avatar: "アバター",
        setting_fullname: "フルネーム",
        setting_fullname_placeholder: "フルネームを入力",
        setting_email: "メール",
        setting_email_placeholder: "メールを入力",
        setting_update_btn: "情報を更新",
        setting_role: "役割",
        setting_created_ex: "作成した演習",
        setting_created_exam: "作成した試験",
        setting_done_ex: "完了した演習",
        setting_done_exam: "完了した試験",
        setting_achievements: "業績",
        setting_logout: "ログアウト",
        setting_delete: "アカウント削除をリクエスト",
    },
    ko: {
        login: "로그인",
        register: "회원가입",
        username: "사용자명",
        password: "비밀번호",
        password2: "비밀번호 확인",
        email: "이메일",
        role: "역할",
        selectRole: "역할 선택",
        teacher: "교사",
        student: "학생",
        admin: "관리자",
        loginDesc: "다시 오신 것을 환영합니다! 계속하려면 로그인하세요.",
        registerDesc: "새 계정을 만들어 시스템 기능을 이용하세요.",
        roleDescLogin: "적절한 권한을 위해 올바른 역할을 선택하세요.",
        roleDescRegister: "올바른 역할을 선택해 계정을 등록하세요.",
        noAccount: "계정이 없으신가요?",
        haveAccount: "이미 계정이 있으신가요?",
        loginBtn: "로그인",
        registerBtn: "회원가입",
        // Sidebar
        sidebar_baitap: "연습",
        sidebar_dethi: "시험",
        sidebar_quanlylop: "클래스 관리",
        sidebar_quanlygv: "교사 관리",
        sidebar_khonoidung: "콘텐츠 라이브러리",
        sidebar_nganhang: "문제 은행",
        sidebar_dexuat: "기능 제안",
        sidebar_setting: "설정",
        sidebar_qlhs: "학생 관리",
        // Dashboard
        dashboard_title: "대시 보드",
        search_placeholder: "검색...",
        // Card
        card_baitap_title: "연습",
        card_baitap_desc: "학생을 위한 연습 관리 및 생성",
        card_dethi_title: "시험",
        card_dethi_desc: "시험 및 테스트 생성 및 관리",
        card_quanlylop_title: "클래스 관리",
        card_quanlylop_desc: "클래스 및 학생 정보 관리",
        card_quanlygv_title: "교사 관리",
        card_quanlygv_desc: "교사 정보 관리",
        card_khonoidung_title: "콘텐츠 라이브러리",
        card_khonoidung_desc: "문서 및 강의 라이브러리",
        card_nganhang_title: "문제 은행",
        card_nganhang_desc: "주제별 질문 모음",
        card_dexuat_title: "기능 제안",
        card_dexuat_desc: "시스템에 대한 새로운 기능 제안",
        card_qlhs_title: "학생 관리",
        card_qlhs_desc: "학생 목록 관리, Excel 파일에서 업로드",
        vip_badge: "VIP",
        // Hỗ trợ
        support_title: "온라인 지원",
        support_ready: "우리는 항상 당신을 지원할 준비가 되어 있습니다!",
        support_contact: "이메일로 연락:",
        support_feedback: "또는 피드백과 제안을 보내주시면 더 나은 서비스를 제공할 수 있습니다.",
        // Question Bank
        nhch_title: "문제 은행",
        nhch_desc: "다른 사용자가 공유한 공개 시험/연습을 보고, 다운로드하거나 사용할 수 있습니다.",
        nhch_empty: "아직 공유된 공개 시험이나 연습이 없습니다.",
        nhch_author: "저자",
        nhch_date: "날짜",
        nhch_download: "보기/다운로드",
        nhch_use: "사용",
        exercise: "연습",
        exam: "시험",
        // Setting
        setting_title: "계정 설정",
        setting_login_required: "계정 설정을 사용하려면 로그인하십시오.",
        setting_avatar: "아바타",
        setting_fullname: "성명",
        setting_fullname_placeholder: "성명을 입력하십시오",
        setting_email: "이메일",
        setting_email_placeholder: "이메일을 입력하십시오",
        setting_update_btn: "정보 업데이트",
        setting_role: "역할",
        setting_created_ex: "생성한 연습",
        setting_created_exam: "생성한 시험",
        setting_done_ex: "완료한 연습",
        setting_done_exam: "완료한 시험",
        setting_achievements: "업적",
        setting_logout: "로그아웃",
        setting_delete: "계정 삭제 요청",
    }
};

// Hàm cập nhật giao diện theo ngôn ngữ
function applyI18n() {
    const t = translations[currentLang];
    // Đổi text cho các thẻ có data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });
    // Đổi placeholder cho các thẻ có data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.setAttribute('placeholder', t[key]);
    });
}

let currentLang = 'vi';

function setLang(lang) {
    currentLang = lang;
    const t = translations[lang];

    // Đăng nhập popup
    document.querySelector('#loginPopup h2').textContent = t.login;
    document.querySelector('#loginPopup .popup-desc').textContent = t.loginDesc;
    document.querySelector('label[for="loginUsername"]').textContent = t.username;
    document.querySelector('label[for="loginPassword"]').textContent = t.password;
    document.querySelector('label[for="loginRole"]').textContent = t.role;
    document.getElementById('loginUsername').placeholder = t.username;
    document.getElementById('loginPassword').placeholder = t.password;
    // Chỉ còn 2 lựa chọn chức vụ
    document.getElementById('loginRole').options[0].textContent = t.selectRole;
    document.getElementById('loginRole').options[1].textContent = t.teacher;
    document.getElementById('loginRole').options[2].textContent = t.student;
    // Ẩn option admin nếu có
    if (document.getElementById('loginRole').options.length > 3) {
        document.getElementById('loginRole').remove(3);
    }
    document.querySelector('#loginForm .role-desc span').textContent = t.roleDescLogin;
    document.querySelector('#loginForm .btn').textContent = t.loginBtn;
    document.querySelector('#loginPopup .switch-link').innerHTML = `${t.noAccount} <a onclick="switchToRegister()">${t.register}</a>`;

    // Đăng ký popup
    document.querySelector('#registerPopup h2').textContent = t.register;
    document.querySelector('#registerPopup .popup-desc').textContent = t.registerDesc;
    document.querySelector('label[for="registerUsername"]').textContent = t.username;
    document.querySelector('label[for="registerEmail"]').textContent = t.email;
    document.querySelector('label[for="registerPassword"]').textContent = t.password;
    document.querySelector('label[for="registerPassword2"]').textContent = t.password2;
    document.querySelector('label[for="registerRole"]').textContent = t.role;
    document.getElementById('registerUsername').placeholder = t.username;
    document.getElementById('registerEmail').placeholder = t.email;
    document.getElementById('registerPassword').placeholder = t.password;
    document.getElementById('registerPassword2').placeholder = t.password2;
    document.getElementById('registerRole').options[0].textContent = t.selectRole;
    document.getElementById('registerRole').options[1].textContent = t.teacher;
    document.getElementById('registerRole').options[2].textContent = t.student;
    // Ẩn option admin nếu có
    if (document.getElementById('registerRole').options.length > 3) {
        document.getElementById('registerRole').remove(3);
    }
    document.querySelector('#registerForm .role-desc span').textContent = t.roleDescRegister;
    document.querySelector('#registerForm .btn').textContent = t.registerBtn;
    document.querySelector('#registerPopup .switch-link').innerHTML = `${t.haveAccount} <a onclick="switchToLogin()">${t.login}</a>`;

    // Nút header
    loginBtn.textContent = "🎯 " + t.login;
    registerBtn.textContent = "💎 " + t.register;

    applyI18n();
}

document.getElementById('langSelect').addEventListener('change', function () {
    setLang(this.value);
});

// Hiệu ứng load trang
window.addEventListener('load', function() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    setLang(currentLang);
    applyI18n();
});

// Map section -> i18n key cho tiêu đề
const sectionTitleMap = {
    "": "dashboard_title",
    "bai-tap": "card_baitap_title",
    "de-thi": "card_dethi_title",
    "quan-ly-hoc-sinh": "card_qlhs_title",
    "kho-noi-dung": "card_khonoidung_title",
    "ngan-hang-cau-hoi": "card_nganhang_title",
    "de-xuat-tinh-nang": "card_dexuat_title",
    "setting": "sidebar_setting"
};

// Ẩn/hiện giao diện từng mục chức năng và cập nhật tiêu đề
function showSection(section) {
    // Ẩn dashboard grid
    document.getElementById('dashboardGrid').style.display = section ? 'none' : '';
    // Ẩn tất cả section-content
    document.querySelectorAll('.section-content').forEach(el => el.style.display = 'none');
    if (section) {
        const el = document.getElementById('section-' + section);
        if (el) el.style.display = '';
    }
    // Đổi tiêu đề lớn trên header
    const mainTitle = document.getElementById('mainTitle');
    const t = translations[currentLang];
    const i18nKey = sectionTitleMap[section || ""] || "dashboard_title";
    mainTitle.textContent = t[i18nKey] || "";
}

// Gắn lại sự kiện cho sidebar/card
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        const section = this.getAttribute('data-section');
        showSection(section);
    });
});
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function(e) {
        const section = this.getAttribute('onclick').match(/'([^']+)'/)[1];
        showSection(section);
    });
});

// Khi đổi ngôn ngữ cũng cập nhật lại tiêu đề nếu không phải dashboard
function setLang(lang) {
    currentLang = lang;
    const t = translations[lang];

    // Đăng nhập popup
    document.querySelector('#loginPopup h2').textContent = t.login;
    document.querySelector('#loginPopup .popup-desc').textContent = t.loginDesc;
    document.querySelector('label[for="loginUsername"]').textContent = t.username;
    document.querySelector('label[for="loginPassword"]').textContent = t.password;
    document.querySelector('label[for="loginRole"]').textContent = t.role;
    document.getElementById('loginUsername').placeholder = t.username;
    document.getElementById('loginPassword').placeholder = t.password;
    // Chỉ còn 2 lựa chọn chức vụ
    document.getElementById('loginRole').options[0].textContent = t.selectRole;
    document.getElementById('loginRole').options[1].textContent = t.teacher;
    document.getElementById('loginRole').options[2].textContent = t.student;
    // Ẩn option admin nếu có
    if (document.getElementById('loginRole').options.length > 3) {
        document.getElementById('loginRole').remove(3);
    }
    document.querySelector('#loginForm .role-desc span').textContent = t.roleDescLogin;
    document.querySelector('#loginForm .btn').textContent = t.loginBtn;
    document.querySelector('#loginPopup .switch-link').innerHTML = `${t.noAccount} <a onclick="switchToRegister()">${t.register}</a>`;

    // Đăng ký popup
    document.querySelector('#registerPopup h2').textContent = t.register;
    document.querySelector('#registerPopup .popup-desc').textContent = t.registerDesc;
    document.querySelector('label[for="registerUsername"]').textContent = t.username;
    document.querySelector('label[for="registerEmail"]').textContent = t.email;
    document.querySelector('label[for="registerPassword"]').textContent = t.password;
    document.querySelector('label[for="registerPassword2"]').textContent = t.password2;
    document.querySelector('label[for="registerRole"]').textContent = t.role;
    document.getElementById('registerUsername').placeholder = t.username;
    document.getElementById('registerEmail').placeholder = t.email;
    document.getElementById('registerPassword').placeholder = t.password;
    document.getElementById('registerPassword2').placeholder = t.password2;
    document.getElementById('registerRole').options[0].textContent = t.selectRole;
    document.getElementById('registerRole').options[1].textContent = t.teacher;
    document.getElementById('registerRole').options[2].textContent = t.student;
    // Ẩn option admin nếu có
    if (document.getElementById('registerRole').options.length > 3) {
        document.getElementById('registerRole').remove(3);
    }
    document.querySelector('#registerForm .role-desc span').textContent = t.roleDescRegister;
    document.querySelector('#registerForm .btn').textContent = t.registerBtn;
    document.querySelector('#registerPopup .switch-link').innerHTML = `${t.haveAccount} <a onclick="switchToLogin()">${t.login}</a>`;

    // Nút header
    loginBtn.textContent = "🎯 " + t.login;
    registerBtn.textContent = "💎 " + t.register;

    applyI18n();
    // Cập nhật lại tiêu đề lớn nếu không phải dashboard
    const currentSection = getCurrentSection();
    showSection(currentSection);
};

// Hàm lấy section hiện tại dựa trên dashboardGrid hiển thị hay không
function getCurrentSection() {
    if (document.getElementById('dashboardGrid').style.display === '' || document.getElementById('dashboardGrid').style.display === 'block' || document.getElementById('dashboardGrid').style.display === undefined) {
        return "";
    }
    // Tìm section-content đang hiển thị
    const shown = Array.from(document.querySelectorAll('.section-content')).find(el => el.style.display === '');
    if (shown && shown.id.startsWith('section-')) {
        return shown.id.replace('section-', '');
    }
    return "";
}

// Khi load trang, hiển thị dashboard
showSection('');


// Đăng xuất
document.getElementById('settingLogoutBtn').onclick = function() {
    window.currentUser = null;
    clearLoginSession();
    if (typeof showUserProfile === 'function') showUserProfile();
    renderAccountSetting();
};

// Khi load lại trang, tự động đăng nhập nếu có session
window.addEventListener('DOMContentLoaded', function () {
    const sessionUser = loadLoginSession();
    if (sessionUser) {
        window.currentUser = sessionUser;
        showUserProfile && showUserProfile();
    }
});

// Sidebar mobile toggle logic
window.addEventListener('DOMContentLoaded', function () {
    // Sidebar mobile toggle
    const sidebar = document.querySelector('.sidebar');
    let sidebarOverlay = document.getElementById('sidebarOverlay');
    if (!sidebarOverlay) {
        sidebarOverlay = document.createElement('div');
        sidebarOverlay.className = 'sidebar-overlay';
        sidebarOverlay.id = 'sidebarOverlay';
        document.body.appendChild(sidebarOverlay);
    }
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    function openSidebarMobile() {
        sidebar.classList.add('sidebar-open');
        sidebar.classList.remove('sidebar-mobile-hide');
        sidebarOverlay.classList.add('active');
    }
    function closeSidebarMobile() {
        sidebar.classList.remove('sidebar-open');
        sidebar.classList.add('sidebar-mobile-hide');
        sidebarOverlay.classList.remove('active');
    }
    // Ẩn sidebar mặc định trên mobile
    function autoHideSidebarOnMobile() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('sidebar-open');
            sidebar.classList.add('sidebar-mobile-hide');
            sidebarOverlay.classList.remove('active');
        } else {
            sidebar.classList.remove('sidebar-mobile-hide');
            sidebar.classList.remove('sidebar-open');
            sidebarOverlay.classList.remove('active');
        }
    }
    autoHideSidebarOnMobile();
    window.addEventListener('resize', autoHideSidebarOnMobile);

    if (sidebarToggleBtn) {
        sidebarToggleBtn.onclick = function () {
            if (sidebar.classList.contains('sidebar-open')) {
                closeSidebarMobile();
            } else {
                openSidebarMobile();
            }
        };
    }
    sidebarOverlay.onclick = closeSidebarMobile;
    // Đóng sidebar khi chọn menu trên mobile
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function () {
            if (window.innerWidth <= 768) closeSidebarMobile();
        });
    });
});
