const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
<<<<<<< Updated upstream
  sequelize.define(
    'Product',
=======
  const Product = sequelize.define(
    "Product",
>>>>>>> Stashed changes
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
        defaultValue: 'Sin descripción disponible',
      },
      priceArs: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      priceUsd: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
<<<<<<< Updated upstream
=======
      priceWholesale: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
      costUsd: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      costArs: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
>>>>>>> Stashed changes
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
            msg: 'IMEI must be exactly 15 characters long.',
          },
          isNumeric: {
            msg: 'IMEI must contain only numbers.',
          },
        },
      },
    },
    { timestamps: true, paranoid: true }
  );

  Product.addHook("beforeSave", async (product) => {
    const dollar = await sequelize.models.Dollar.findOne();

    product.costArs = product.costUsd * dollar.rate;
    product.priceUsd = product.costUsd * 2 
    product.priceArs = product.costUsd * 2 * dollar.rate;
    product.priceWholesale = product.costUsd * 1.5 * dollar.rate;
  });

  return Product;
};

