// Giữ key currentUser của học sinh; chỉ đọc thông tin công khai để hiển thị menu.
(() => {
const accountBtn = document.getElementById("accountBtn");
const accountDropdown = document.getElementById("accountDropdown");
const accountLabel = document.getElementById("accountLabel");

const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;
try {
    const value = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (value && typeof value.username === "string" && typeof value.email === "string") currentUser = value;
} catch { /* Dữ liệu hỏng: hiển thị như khách, không làm crash trang sản phẩm. */ }
if (!accountBtn || !accountDropdown || !accountLabel || !logoutBtn) return;
accountBtn.setAttribute("aria-expanded", "false");
accountBtn.setAttribute("aria-controls", "accountDropdown");

// Lấy chữ cái đầu tên
function getInitials(name) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 3)
        .map(word => word.charAt(0).toUpperCase())
        .join("");
}

// Hiển thị tài khoản
if (currentUser) {
    const initials = getInitials(currentUser.username || "User");

accountLabel.textContent = initials;
accountLabel.className = "user-avatar";

const userIcon = document.querySelector(".user-icon");

if (userIcon) {
    userIcon.style.display = "none";
}

    document.getElementById("dropdownAvatar").textContent = initials;
    document.getElementById("dropdownName").textContent =
        currentUser.username || "Người dùng";

    document.getElementById("dropdownEmail").textContent =
        currentUser.email || "";
}

// Bấm tài khoản
accountBtn.addEventListener("click", () => {
    if (!currentUser) {
        location.href = "./login.html";
        return;
    }

    accountDropdown.classList.toggle("show");
    accountBtn.setAttribute("aria-expanded", String(accountDropdown.classList.contains("show")));
});

// Đăng xuất
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    location.href = "./index.html";
});

// Bấm bên ngoài thì đóng menu
document.addEventListener("click", (e) => {
    if (!e.target.closest("#accountArea")) {
        accountDropdown.classList.remove("show");
        accountBtn.setAttribute("aria-expanded", "false");
    }
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        accountDropdown.classList.remove("show");
        accountBtn.setAttribute("aria-expanded", "false");
    }
});
})();
