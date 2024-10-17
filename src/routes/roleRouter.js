const { Router } = require("express");
const { createRole, deleteRole } = require('../handlers/role-handler');


const roleRouter = Router();
roleRouter.post("/", createRole);
roleRouter.delete("/", deleteRole);

module.exports = roleRouter;
