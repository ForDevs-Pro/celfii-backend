const {
  createRoleController,
  deleteRoleController,
  getAllRolesController,
} = require("../controllers/role-controller");
const { Role } = require("../db");

const createRole = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }
    const newRole = await createRoleController(name);
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }
    const response = await deleteRoleController(name);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRoles = async (req, res) => {
  try {
    const { name } = req.query;
    const roles = await getAllRolesController(name);
    const totalCount = await Role.count({
      where: name ? { name: { [Op.iLike]: `%${name}%` } } : {},
    });

    res.set("X-Total-Count", totalCount);
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRole,
  deleteRole,
  getAllRoles,
};
