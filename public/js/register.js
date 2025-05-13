document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.querySelector('form[action="/users/register"]');

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      const firstName = document.getElementById('firstName')?.value.trim();
      const lastName = document.getElementById('lastName')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const password = document.getElementById('password')?.value;

      if (!firstName || !lastName || !email || !password) {
        e.preventDefault();
        alert('All fields are required.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        e.preventDefault();
        alert('Invalid email format.');
      }

      if (password.length < 6) {
        e.preventDefault();
        alert('Password must be at least 6 characters.');
      }
    });
  }
});
