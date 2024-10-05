const { Role } = require('../db');

const createRoleController = async (name) => {
  try {
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      throw new Error('Role already exists');
    }
    const newRole = await Role.create({ name });
    return newRole;
  } catch (error) {
    throw new Error('Error creating role: ' + error.message);
  }
};

const deleteRoleController = async (name) => {
  try {
    const role = await Role.findOne({ where: { name } });
    if (!role) {
      throw new Error('Role not found');
    }
    await role.destroy();
    return { message: 'Role deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting role: ' + error.message);
  }
};

module.exports = {
  createRoleController,
  deleteRoleController,
};
