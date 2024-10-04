const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'ImagesUrl',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      url: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
          isUrlArray(value) {
            value.forEach((url) => {
              if (!DataTypes.STRING.isUrl.validate(url)) {
                throw new Error(`${url} is not a valid URL`);
              }
            });
          },
        },
      },
      alt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );
};
