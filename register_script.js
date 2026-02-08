document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorMessage = document.getElementById('error-message'); // Ensure this ID exists in your HTML if needed

    // 1. Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    // 2. Simple password strength check
    if (password.length < 8) {
        alert("For your security, passwords must be at least 8 characters long.");
        return;
    }

    // 3. Success Simulation
    alert("Registration successful! Redirecting to login...");
    window.location.href = "login.html";
});