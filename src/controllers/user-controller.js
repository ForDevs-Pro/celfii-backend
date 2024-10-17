const { User } = require('../db');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

const createUserController = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUserData = { ...userData, password: hashedPassword };

    const newUser = await User.create(newUserData);
    return newUser;
  } catch (error) {
    console.error('Error creating user: ' + error.message);
    throw new Error('Error creating user: ' + error.message);
  }
};

const getAllUsersController = async (includeDeleted = false) => {
  try {
    const users = await User.findAll({
      paranoid: !includeDeleted,
    });
    return users;
  } catch (error) {
    console.error('Error fetching users: ' + error.message);
    throw new Error('Error fetching users: ' + error.message);
  }
};

const getUserByIdController = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      console.error('User not found');
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Error fetching user: ' + error.message);
    throw new Error('Error fetching user: ' + error.message);
  }
};

const updateUserController = async (id, updateData) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      console.error('User not found');
      throw new Error('User not found');
    }
    await user.update(updateData);
    return user;
  } catch (error) {
    console.error('Error updating user: ' + error.message);
    throw new Error('Error updating user: ' + error.message);
  }
};

const deleteUserController = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      console.error('User not found');
      throw new Error('User not found');
    }
    await user.destroy();
    return { message: 'User deleted successfully' };
  } catch (error) {
    console.error('Error deleting user: ' + error.message);
    throw new Error('Error deleting user: ' + error.message);
  }
};

const restoreUserController = async (id) => {
  try {
    const user = await User.findByPk(id, { paranoid: false });
    if (!user) {
      console.error('User not found');
      throw new Error('User not found');
    }
    await user.restore();
    return { message: 'User restored successfully' };
  } catch (error) {
    console.error('Error restoring user: ' + error.message);
    throw new Error('Error restoring user: ' + error.message);
  }
};

module.exports = {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  restoreUserController,
};
