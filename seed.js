import { dbConnection, closeConnection } from './config/mongoConnections.js';
import userData from './data/users.js';
import boardData from './data/boards.js';
import taskData from './data/tasks.js';

const seed = async () => {
  const db = await dbConnection();
  await db.dropDatabase();

  console.log('Seeding data...');

  // Create Users
  const admin = await userData.createUser(
    'Admin',
    'User',
    'admin@example.com',
    'Password123!',
    'admin',
    'light'
  );

  const user1 = await userData.createUser(
    'John',
    'Doe',
    'john@example.com',
    'Password123!',
    'viewer',
    'dark'
  );

  const user2 = await userData.createUser(
    'Jane',
    'Smith',
    'jane@example.com',
    'Password123!',
    'viewer',
    'light'
  );

  // Create Board
  const board = await boardData.createBoard('Team Roadmap', 'Q2 Planning', admin._id);

  await boardData.addMemberToBoard(board.boardId, admin._id, 'admin');
  await boardData.addMemberToBoard(board.boardId, user1._id, 'viewer');
  await boardData.addMemberToBoard(board.boardId, user2._id, 'viewer');

  // Create Tasks
  await taskData.createTask(
    board.boardId,
    'Kickoff Meeting',
    'Initial project kickoff and stakeholder alignment',
    'High',
    'open',
    new Date('2025-06-01'),
    admin._id,
    null
  );

  await taskData.createTask(
    board.boardId,
    'Design Mockups',
    'Create UI mockups for homepage and dashboard',
    'Medium',
    'open',
    new Date('2025-06-10'),
    user1._id,
    null
  );

  await taskData.createTask(
    board.boardId,
    'Backend Setup',
    'Initialize Express app and connect MongoDB',
    'Medium',
    'open',
    new Date('2025-06-15'),
    user2._id,
    null
  );

  console.log('Seeding for tasks complete!');
  await closeConnection();
};

seed().catch(console.error);
