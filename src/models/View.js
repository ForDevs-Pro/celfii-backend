const { DataTypes } = require('sequelize');

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
    },
    {
      timestamps: true,
    }
  );
};
