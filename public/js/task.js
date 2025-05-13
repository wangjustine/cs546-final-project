document.addEventListener('DOMContentLoaded', () => {
    const completeButtons = document.querySelectorAll('.complete-task-btn');
    completeButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        const taskId = button.dataset.taskId;
  
        try {
          const res = await fetch(`/tasks/${taskId}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'complete' })
          });
  
          if (res.ok) {
            button.textContent = '✓ Completed';
            button.disabled = true;
          } else {
            alert('Failed to update task status.');
          }
        } catch (err) {
          console.error('Error completing task:', err);
        }
      });
    });
  
    const taskTitles = document.querySelectorAll('.task-title');
    const modal = document.getElementById('taskModal');
    const closeModal = document.getElementById('closeModal');
  
    taskTitles.forEach((title) => {
      title.addEventListener('click', async () => {
        const taskId = title.dataset.taskId;
        try {
          const res = await fetch(`/tasks/${taskId}`);
          if (!res.ok) throw new Error('Task fetch failed');
          const task = await res.json();
          document.getElementById('modal-title').textContent = task.title;
          document.getElementById('modal-description').textContent = task.description;
          document.getElementById('modal-priority').textContent = `Priority: ${task.priority}`;
          document.getElementById('modal-deadline').textContent = `Deadline: ${task.deadline}`;
          modal.classList.add('visible');
        } catch (err) {
          console.error(err);
        }
      });
    });
  
    if (closeModal && modal) {
      closeModal.addEventListener('click', () => {
        modal.classList.remove('visible');
      });
    }
    const taskForm = document.getElementById('new-task-form');
    if (taskForm) {
      taskForm.addEventListener('submit', (e) => {
        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-description').value.trim();
        const priority = document.getElementById('task-priority').value.trim().toLowerCase();
        const deadline = document.getElementById('task-deadline').value;

        const validPriorities = ['low', 'medium', 'high'];
        const isValidDate = !isNaN(Date.parse(deadline));

        let error = null;
        if (!title) error = 'Title is required.';
        else if (!description) error = 'Description is required.';
        else if (!validPriorities.includes(priority)) error = 'Priority must be low, medium, or high.';
        else if (!isValidDate) error = 'Deadline must be a valid date.';

  
        if (error) {
          e.preventDefault();
          alert(error);
        }
      });
    }
  });
  