document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.update-role-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      const category = form.querySelector('[name="category"]').value;
      if (!category) {
        e.preventDefault();
        alert('Role/category is required');
      }
    });
  });

  document.querySelectorAll('.add-to-board-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      const boardId = form.querySelector('[name="boardId"]').value.trim();
      const role = form.querySelector('[name="role"]').value.trim();
      if (!boardId || !role) {
        e.preventDefault();
        alert('Board ID and role are required.');
      }
    });
  });
});
