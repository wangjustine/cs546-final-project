async function handleFormSubmission(form, url, successMessage) {
  const formData = new FormData(form);
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest' 
      }
    });
    const result = await response.json();
    if (response.ok) {
      alert(successMessage);
      window.location.reload(); 
    } else {
      alert(result.error || 'An error occurred.');
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    alert('An error occurred while processing your request.');
  }
}

const roleForms = document.querySelectorAll('.role-form');
roleForms.forEach(form => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const userId = form.dataset.userId;
    await handleFormSubmission(form, `/admin/users/${userId}/role`, 'User role updated successfully!');
  });
});

const removeForms = document.querySelectorAll('.remove-form');
removeForms.forEach(form => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const userId = form.dataset.userId;
    await handleFormSubmission(form, `/admin/users/${userId}/remove`, 'User removed successfully!');
  });
});

const addToBoardForms = document.querySelectorAll('.add-to-board-form');
addToBoardForms.forEach(form => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const userId = form.dataset.userId;
    await handleFormSubmission(form, `/admin/users/${userId}/addToBoard`, 'User added to board successfully!');
  });
});