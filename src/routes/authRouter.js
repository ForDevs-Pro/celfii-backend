const { Router } = require('express');
const { loginUser } = require('../handlers/auth-handler');
const authRouter = Router();

authRouter.post('/login', loginUser);

module.exports = authRouter;
