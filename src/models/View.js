const { DataTypes } = require('sequelize');
const { Product } = require("./Product")

module.exports = (sequelize) => {
  sequelize.define(
    'View',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      counter: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        references: {
          model: Product,
          key: 'id',
        },
      },
    },
    {
      timestamps: true,
    }
  );
};
