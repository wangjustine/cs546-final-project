import { boards } from '../config/mongoCollections.js';

const createBoard = async (title, description, createdBy) => {
  const boardCollection = await boards();

  const newBoard = {
    boardId: uuid(),
    title,
    description,
    createdAt: new Date(),
    createdBy,
    members: [],
    comments: [] 
  };

  const insertInfo = await boardCollection.insertOne(newBoard);
  if (!insertInfo.acknowledged) throw 'Could not create board';

  return newBoard;
};


const isMember = (board, userId) => {
  return board.members.some(m => m.userId === userId);
};

const isAdmin = (board, userId) => {
  return board.members.some(m => m.userId === userId && m.role === 'admin');
};
const addMemberToBoard = async (boardId, userId, role) => {
  const boardCollection = await boards();
  const updateInfo = await boardCollection.updateOne(
    { boardId: boardId },
    { $push: { members: { userId: userId, role: role, joinedAt: new Date() } } }
  );
  if (!updateInfo.modifiedCount) throw 'Could not add member to board';
};
const getBoardById = async (boardId) => {
  const boardCollection = await boards();
  const board = await boardCollection.findOne({boardId});
  if (!board) throw 'Board not found';
  return board;
};
const getBoardsByUserId = async (userId) => {
  const boardCollection = await boards();
  const allBoards = await boardCollection.find({ "members.userId": userId }).toArray();
  return allBoards;
};

const getBoardByIdWithComments = async (boardId) => {
  if (!boardId) 
    throw 'You must provide a boardId to search for';
  if (typeof boardId !== 'string') 
    throw 'boardId must be a string';
  const boardCollection = await boards();
  try {
    const board = await boardCollection.findOne({ boardId: boardId });
    if (!board) 
      throw 'Board not found';
    return board;
  } catch (error) {
    throw `Could not get board with id: ${boardId}. ${error}`;
  }
};

export default {
  createBoard,
  addMemberToBoard,
  isMember,
  isAdmin,
  getBoardsByUserId,
  getBoardById,
  getBoardByIdWithComments };
