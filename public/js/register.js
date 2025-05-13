document.addEventListener('DOMContentLoaded', () => {
  let registerForm = document.querySelector('form[action="/users/register"]');

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      let firstName = document.getElementById('firstName')?.value.trim();
      let lastName = document.getElementById('lastName')?.value.trim();
      let email = document.getElementById('email')?.value.trim();
      let password = document.getElementById('password')?.value;

      if (!firstName || !lastName || !email || !password) {
        e.preventDefault();
        alert('All fields are required.');
        return;
      }

      let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
