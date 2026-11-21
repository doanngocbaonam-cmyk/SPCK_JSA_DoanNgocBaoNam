const accountBtn = document.getElementById("accountBtn");
const accountDropdown = document.getElementById("accountDropdown");
const accountLabel = document.getElementById("accountLabel");

const logoutBtn = document.getElementById("logoutBtn");

const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
);

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
    }
});