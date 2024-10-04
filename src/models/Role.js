const { DataTypes } = require("sequelize");
const { User } = require("./User");

module.exports = (sequelize) => {
  sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
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
