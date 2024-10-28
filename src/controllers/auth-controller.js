const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Role } = require("../db");

const loginUserController = async (email, password) => {
  try {
    const user = await User.findOne({
      where: { email },
      include: { model: Role, as: "role" },
    });

    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role.name },
      process.env.ACCESS_TOKEN_SECRET
    );

    return { user, token: accessToken };
  } catch (error) {
    console.error("Error login:", error);
    throw new Error("Error login");
  }
};

module.exports = {
  loginUserController,
};
