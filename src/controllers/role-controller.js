const { Role } = require("../db");

const createRoleController = async (name) => {
  try {
    const [role, created] = await Role.findOrCreate({
      where: { name },
    });
    if (!created) throw new Error("Role already exists");
    return role;
  } catch (error) {
    console.error("Error creating role: " + error.message);
    throw new Error("Error creating role: " + error.message);
};

const deleteRoleController = async (name) => {
  try {
    const role = await Role.findOne({ where: { name } });
    if (!role) throw new Error("Role not found");
    await role.destroy();
    return { message: "Role deleted successfully" };
  } catch (error) {
    console.error("Error creating role: " + error.message);
    throw new Error("Error deleting role: " + error.message);
  }
};

const getAllRolesController = async (name) => {
  try {
    const where = name ? { name: { [Op.iLike]: `%${name}%` } } : {};
    const roles = await Role.findAll({ where });
    return roles;
  } catch (error) {
    console.error("Error fetching roles: " + error.message);
    throw new Error("Error fetching roles: " + error.message);
  }
};

module.exports = {
  createRoleController,
  deleteRoleController,
  getAllRolesController,
};
