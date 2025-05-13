document.addEventListener('DOMContentLoaded', () => {
  const addMemberForm = document.getElementById('add-member-form');

  if (addMemberForm) {
    addMemberForm.addEventListener('submit', (e) => {
      const userId = document.getElementById('userId')?.value.trim();
      if (!userId) {
        e.preventDefault();
        alert('User ID is required.');
      }
    });
  }
});
