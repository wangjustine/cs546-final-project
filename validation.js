import { ObjectId } from 'mongodb';

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

const isValidObjectId = (id) => {
  return ObjectId.isValid(id);
};

const validateTaskInput = ({ title, description, priority, deadline, status, createdBy, assignedTo }) => {
  if (!isNonEmptyString(title)) throw 'Title must be a non-empty string.';
  if (!isNonEmptyString(description)) throw 'Description must be a non-empty string.';
  if (!isValidPriority(priority)) throw 'Priority must be low, medium, or high.';
  if (!isValidDate(deadline)) throw 'Deadline must be a valid date.';
  if (!isValidStatus(status)) throw 'Status must be one of: open, in progress, completed, closed.';
  if (!isValidObjectId(createdBy)) throw 'CreatedBy must be a valid ObjectId.';
  if (assignedTo && !isValidObjectId(assignedTo)) throw 'AssignedTo must be a valid ObjectId if provided.';
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
  isValidObjectId,
  validateTaskInput,
  validateUserInput
};
