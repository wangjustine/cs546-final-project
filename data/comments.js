import { tasks } from '../config/mongoCollections.js';
import { v4 as uuid } from 'uuid';

const addComment = async (taskId, userId, commentText) => {
  const taskCollection = await tasks();

  const newComment = {
    _id: uuid(),
    taskId,
    userId,
    commentText,
    createdAt: new Date()
  };

  const updateInfo = await taskCollection.updateOne(
    { _id: taskId },
    { $push: { comments: newComment } }
  );
  if (!updateInfo.modifiedCount) throw 'Could not add comment';
};

const deletecomment = async (taskId, commentId) => {
  const taskCollection = await tasks();
  const updateInfo = await taskCollection.updateOne(
    { _id: taskId },
    { $pull: { comments: { _id: commentId } } }
  );
  if (!updateInfo.modifiedCount) throw 'Could not delete comment';
};

export default { addComment , deletecomment};
