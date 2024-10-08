const { Router } = require("express");
const { createRole, deleteRole } = require('../handlers/roleHandler');


const roleRouter = Router();
roleRouter.post("/", createRole);
roleRouter.delete("/", deleteRole);

module.exports = roleRouter;
