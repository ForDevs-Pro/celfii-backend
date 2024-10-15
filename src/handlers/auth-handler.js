const { loginUserController } = require('../controllers/auth-controller');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await loginUserController(email, password);
    return res.status(200).json(response);
  } catch (error) {
    res.status(401).json(error);
  }
};

module.exports = {
  loginUser,
};
