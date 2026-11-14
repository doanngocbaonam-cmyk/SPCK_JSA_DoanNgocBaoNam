if (localStorage.getItem("currentUser")) {
    location.href = "./index.html";
}

const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const lowerCaseLetter = /[a-z]/;
    const upperCaseLetter = /[A-Z]/;
    const numbers = /[0-9]/;

    if (username.length < 6) {
        alert("Họ tên phải có ít nhất 6 ký tự");
    } else if (password.length < 8) {
        alert("Mật khẩu phải có ít nhất 8 ký tự");
    } else if (!lowerCaseLetter.test(password)) {
        alert("Mật khẩu phải có chữ thường");
    } else if (!upperCaseLetter.test(password)) {
        alert("Mật khẩu phải có chữ hoa");
    } else if (!numbers.test(password)) {
        alert("Mật khẩu phải có ít nhất một chữ số");
    } else if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp");
    } else {
        let users = JSON.parse(localStorage.getItem("users") || "[]");

        if (users.some(user => user.email === email)) {
            alert("Email này đã được đăng ký!");
            return;
        }

        users.push({
            username,
            email,
            password
        });

        localStorage.setItem("users", JSON.stringify(users));

        alert("Đăng ký thành công! Hãy đăng nhập.");
        location.href = "./login.html";
    }
});