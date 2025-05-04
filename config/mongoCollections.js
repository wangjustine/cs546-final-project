import {dbConnection} from './mongoConnections.js';

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

export const users = getCollectionFn('users');

export const comments = getCollectionFn('comments');

export const boards = getCollectionFn('boards');

export const notifications = getCollectionFn('notifications');

export const tasks = getCollectionFn('tasks');

export const activityLogs = getCollectionFn('activityLogs');


