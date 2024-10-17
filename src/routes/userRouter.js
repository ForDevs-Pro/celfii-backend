const { Router } = require('express');
const { checkMaster } = require('../middlewares/master-middleware.js');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  restoreUser,
} = require('../handlers/userHandler.js');

const userRouter = Router();

userRouter.post('/', checkMaster, createUser);
userRouter.get('/', checkMaster, getAllUsers);
userRouter.get('/:id', checkMaster, getUserById);
userRouter.put('/:id', checkMaster, updateUser);
userRouter.delete('/:id', checkMaster, deleteUser);
userRouter.post('/:id/restore', checkMaster, restoreUser);

module.exports = userRouter;
