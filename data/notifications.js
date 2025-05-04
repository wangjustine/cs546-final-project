import { notifications } from '../config/mongoCollections.js';
import { v4 as uuid } from 'uuid';

const createNotification = async (taskId, userId, message, type) => {
  const notificationCollection = await notifications();

  const newNotification = {
    _id: uuid(),
    taskId,
    userId,
    message,
    type,
    seen: false,
    timestamp: new Date()
  };

  const insertInfo = await notificationCollection.insertOne(newNotification);
  if (!insertInfo.acknowledged) throw 'Could not create notification';

  return newNotification;
};


export default { createNotification };
