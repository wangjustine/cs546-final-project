document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
