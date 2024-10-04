const { DataTypes } = require('sequelize');
const { Product } = require('./Product');

module.exports = (sequelize) => {
  sequelize.define(
    'Image',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alt: {
        type: DataTypes.STRING,
        allowNull: true,
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
