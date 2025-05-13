document.addEventListener('DOMContentLoaded', () => {
  let addMemberForm = document.getElementById('add-member-form');

  if (addMemberForm) {
    addMemberForm.addEventListener('submit', (e) => {
      let userId = document.getElementById('userId')?.value.trim();
      if (!userId) {
        e.preventDefault();
        alert('User ID is required.');
      }
    });
  }
});
