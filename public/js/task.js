document.addEventListener('DOMContentLoaded', () => {
    let completeButtons = document.querySelectorAll('.complete-task-btn');
    completeButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        let taskId = button.dataset.taskId;
  
        try {
          let res = await fetch(`/tasks/${taskId}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'complete' })
          });
  
          if (res.ok) {
            button.textContent = 'Completed.';
            button.disabled = true;
          } else {
            alert('Failed to update task status.');
          }
        } catch (err) {
          console.error('Error completing task:', err);
        }
      });
    });
  
    // Show modal on task title click
    let taskTitles = document.querySelectorAll('.task-title');
    let modal = document.getElementById('taskModal');
    let closeModal = document.getElementById('closeModal');
  
    taskTitles.forEach((title) => {
      title.addEventListener('click', async () => {
        let taskId = title.dataset.taskId;
        try {
          let res = await fetch(`/tasks/${taskId}`);
          if (!res.ok) throw new Error('Task fetch failed');
          let task = await res.json();
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

    // AJAX form for new task
    let taskForm = document.getElementById('new-task-form');
    if (taskForm) {
      taskForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // prevent full page reload

        let title = document.getElementById('task-title').value.trim();
        let description = document.getElementById('task-description').value.trim();
        let priority = document.getElementById('task-priority').value.trim().toLowerCase();
        let deadline = document.getElementById('task-deadline').value;
        let status = document.getElementById('task-status').value.trim();
        let createdBy = document.getElementById('task-createdBy').value.trim();
        let assignedTo = document.getElementById('task-assignedTo').value.trim();
        let boardId = document.getElementById('boardId').value;

        let validPriorities = ['low', 'medium', 'high'];
        let isValidDate = !isNaN(Date.parse(deadline));
        let error = null;

        if (!title || !description || !priority || !deadline || !status || !createdBy || !assignedTo) {
          error = 'All fields are required.';
        } else if (!validPriorities.includes(priority)) {
          error = 'Priority must be low, medium, or high.';
        } else if (!isValidDate) {
          error = 'Deadline must be a valid date.';
        }

        if (error) {
          alert(error);
          return;
        }

        try {
          let res = await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              boardId, title, description, priority, status, deadline, createdBy, assignedTo
            })
          });

          if (res.ok) {
            alert('Task created successfully!');
            taskForm.reset();
          } else {
            const err = await res.json();
            alert(`Failed to create task: ${err.error}`);
          }
        } catch (err) {
          console.error('AJAX task creation failed:', err);
          alert('Something went wrong while submitting the task.');
        }
      });
    }
  });
  