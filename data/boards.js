import { boards } from '../config/mongoCollections.js';
import { v4 as uuid } from 'uuid';

const createBoard = async (title, description, createdBy) => {
  const boardCollection = await boards();

  const newBoard = {
    boardId: uuid(),
    title,
    description,
    createdAt: new Date(),
    createdBy,
    members: []
  };

  const insertInfo = await boardCollection.insertOne(newBoard);
  if (!insertInfo.acknowledged) throw 'Could not create board';

  return newBoard;
};

const addMemberToBoard = async (boardId, userId, role) => {
  const boardCollection = await boards();
  const updateInfo = await boardCollection.updateOne(
    { boardId: boardId },
    { $push: { members: { userId: userId, role: role, joinedAt: new Date() } } }
  );
  if (!updateInfo.modifiedCount) throw 'Could not add member to board';
};

export default { createBoard, addMemberToBoard };
