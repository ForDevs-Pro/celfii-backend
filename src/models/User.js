const { DataTypes } = require("sequelize");
const Role = require("./Role");

module.exports = (sequelize) => {
  sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Role,
          key: "id",
        },
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    {
      timestamps: true,
    }
  );
};
