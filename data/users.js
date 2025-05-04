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
    preference
  };

  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged) throw 'Could not add user';

  return newUser;
};

const getUserByEmail = async (email) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });
  if (!user) throw 'User not found';
  return user;
};

export default { createUser, getUserByEmail };
