document.addEventListener('DOMContentLoaded', () => {
  let loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      let email = document.getElementById('login-email').value.trim();
      let password = document.getElementById('login-password').value;

      let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailRegex.test(email)) {
        e.preventDefault();
        alert('Please enter a valid email address.');
        return;
      }

      if (!password || password.length < 6) {
        e.preventDefault();
        alert('Password must be at least 6 characters.');
      }
    });
  }
});
