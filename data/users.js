import { users } from '../config/mongoCollections.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

const saltRounds = 10;

const createUser = async (firstName, lastName, email, password, category, preference) => {
  const userCollection = await users();
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = {
    _id: uuid(),
    firstName,
    lastName,
    email,
    hashedPassword,
    category,
  };

  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged) throw 'Could not add user';

  return newUser;
};
const getUserById = async (id) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: id });
  if (!user) throw 'User not found';
  return user;
};

const getUserByEmail = async (email) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });
  if (!user) throw 'User not found';
  return user;
};
export const getAllUsers = async () => {
  const userCollection = await users();
  return await userCollection.find({}).toArray();
};

export const updateUserRole = async (userId, newRole) => {
  const userCollection = await users();
  const updateInfo = await userCollection.updateOne(
    {_id: userId},
    {$set:{category: newRole}}
  );
  if (!updateInfo.modifiedCount) 
    throw 'Failed to update user role';
};

export const deleteUser = async (userId) => {
  const userCollection = await users();
  const deleteInfo = await userCollection.deleteOne({ _id: userId });
  if (!deleteInfo.deletedCount) 
    throw 'Failed to delete user';
};

export default { createUser, getUserByEmail, getUserById };
