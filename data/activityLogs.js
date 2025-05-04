import { activityLogs } from '../config/mongoCollections.js';
import { v4 as uuid } from 'uuid';

const logActivity = async (boardId, action, taskId) => {
  const activityCollection = await activityLogs();

  const newLog = {
    _id: uuid(),
    boardId,
    action,
    taskId,
    timestamp: new Date()
  };

  const insertInfo = await activityCollection.insertOne(newLog);
  if (!insertInfo.acknowledged) throw 'Could not log activity';
};

export default { logActivity };
