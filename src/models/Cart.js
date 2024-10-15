const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'Cart',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: false,
      },
      productId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    { timestamps: true }
  );
};
