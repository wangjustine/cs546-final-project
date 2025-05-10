import { tasks } from '../config/mongoCollections.js';
import { v4 as uuid } from 'uuid';

const createTask = async (boardId, title, description, priority, status, deadline, createdBy, assignedTo) => {
  const taskCollection = await tasks();

  const newTask = {
    _id: uuid(),
    boardId,
    title,
    description,
    priority,
    status,
    labels: [],
    deadline,
    createdBy,
    assignedTo,
    createdAt: new Date(),
    updatedAt: new Date(),
    isOverdue: false,
    comments: []
  };

  const insertInfo = await taskCollection.insertOne(newTask);
  if (!insertInfo.acknowledged) throw 'Could not create task';

  return newTask;
};

const getTaskById = async (taskId) => {
  const taskCollection = await tasks();
  const task = await taskCollection.findOne({ _id: taskId });
  if (!task) throw 'Task not found';
  return task;
};
const getTasksByBoardId = async (boardId) => {
  const taskCollection = await tasks();
  const tasksList = await taskCollection.find({ boardId: boardId }).toArray();
  return tasksList;
};
const updateTaskStatus = async (taskId, newStatus) => {
  const taskCollection = await tasks();
  const updateInfo = await taskCollection.updateOne(
    { _id: taskId },
    { $set: { status: newStatus, updatedAt: new Date() } }
  );
  if (!updateInfo.modifiedCount) throw 'Could not update task status';
};

export default { createTask, updateTaskStatus, getTaskById ,getTasksByBoardId};
