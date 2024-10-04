const { DataTypes } = require('sequelize');
const { Product } = require('./Product');

module.exports = (sequelize) => {
  sequelize.define(
    'View',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Product,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      timestamps: true,
    }
  );
};
