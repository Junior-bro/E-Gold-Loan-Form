document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Simple demo validation (replace with real backend check)
  if (username === "admin" && password === "12345") {
    window.location.href = "dashboard.html"; // Redirect after successful login
  } else {
    document.getElementById("error-message").textContent = "Invalid username or password!";
  }
});