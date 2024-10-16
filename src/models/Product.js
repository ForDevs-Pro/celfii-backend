const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "Sin descripción disponible",
      },
      priceArs: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      priceUsd: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imei: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [15, 15],
            msg: "IMEI must be exactly 15 characters long.",
          },
          isNumeric: {
            msg: "IMEI must contain only numbers.",
          },
        },
      },
    },
    { timestamps: true, paranoid: true }
  );
};
