const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Dollar", {
    rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 0 },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
};
