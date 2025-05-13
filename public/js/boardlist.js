document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-board-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      const title = document.getElementById('board-title').value.trim();
      const desc = document.getElementById('board-description').value.trim();
      if (!title || !desc) {
        e.preventDefault();
        alert('Title and description are required.');
      }
    });
  }
});
