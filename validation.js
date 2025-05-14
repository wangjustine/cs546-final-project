const isNonEmptyString = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidDate = (dateStr) => {
  return !isNaN(Date.parse(dateStr));
};

const isValidPriority = (value) => {
  return ['low', 'medium', 'high'].includes(value.toLowerCase());
};

const isValidUUId = (id) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};


const validateTaskInput = ({ title, description, priority, deadline, status, createdBy, assignedTo }) => {
  if (!isNonEmptyString(title)) throw 'Title must be a non-empty string.';
  if (!isNonEmptyString(description)) throw 'Description must be a non-empty string.';
  if (!isValidPriority(priority)) throw 'Priority must be low, medium, or high.';
  if (!isValidDate(deadline)) throw 'Deadline must be a valid date.';
  if (!isValidStatus(status)) throw 'Status must be one of: open, in progress, completed, closed.';
  if (!isValidUUId(createdBy)) throw 'CreatedBy must be a valid UUId.';
  if (assignedTo && !isValidUUId(assignedTo)) throw 'AssignedTo must be a valid UUId if provided.';
};

const validateUserInput = ({ firstName, lastName, email, password }) => {
  if (!isNonEmptyString(firstName)) throw 'First name is required.';
  if (!isNonEmptyString(lastName)) throw 'Last name is required.';
  if (!isValidEmail(email)) throw 'Invalid email format.';
  if (!isNonEmptyString(password) || password.length < 6) throw 'Password must be at least 6 characters.';
};

export {
  isNonEmptyString,
  isValidEmail,
  isValidDate,
  isValidPriority,
  isValidUUId,
  validateTaskInput,
  validateUserInput
};
