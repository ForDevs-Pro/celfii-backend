const { User } = require('../db');
const { Op } = require('sequelize');

const createUserController = async (userData) => {
  try {
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    throw new Error('Error creating user: ' + error.message);
  }
};

const getAllUsersController = async (includeDeleted = false) => {
    try {
      let whereClause = {};
  
      if (includeDeleted) {
        whereClause = { deletedAt: { [Op.ne]: null } }; 
      }
      const users = await User.findAll({
        where: whereClause,
        paranoid: !includeDeleted, 
      });
      return users;
    } catch (error) {
      throw new Error('Error fetching users: ' + error.message);
    }
  };

const getUserByIdController = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Error fetching user: ' + error.message);
  }
};

const updateUserController = async (id, updateData) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.update(updateData);
    return user;
  } catch (error) {
    throw new Error('Error updating user: ' + error.message);
  }
};

const deleteUserController = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.destroy();
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting user: ' + error.message);
  }
};

const restoreUserController = async (id) => {
  try {
    const user = await User.findByPk(id, { paranoid: false });
    if (!user) {
      throw new Error('User not found');
    }
    await user.restore();
    return { message: 'User restored successfully' };
  } catch (error) {
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
