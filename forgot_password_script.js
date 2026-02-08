document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const identity = document.getElementById('recovery-identity').value;

    // Simulate an API call to the backend
    console.log("Processing reset for:", identity);

    // Hide form and show success message
    document.getElementById('forgotPasswordForm').style.display = 'none';
    document.querySelector('.instruction-text').style.display = 'none';
    document.getElementById('success-container').style.display = 'block';
});