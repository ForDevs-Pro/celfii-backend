const { Router } = require('express');
const { createRole, deleteRole, getAllRoles } = require('../handlers/roleHandler');

const roleRouter = Router();
roleRouter.post('/', createRole);
roleRouter.delete('/', deleteRole);
roleRouter.get('/', getAllRoles);

module.exports = roleRouter;
