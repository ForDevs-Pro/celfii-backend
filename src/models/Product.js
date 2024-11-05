const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "Sin descripción disponible",
      },
      priceArs: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      priceUsd: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      priceWholesale: {
        type: DataTypes.DECIMAL(10, 2),
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
      },
    },
    { timestamps: true, paranoid: true }
  );

  Product.addHook("beforeSave", async (product) => {
    const dollar = await sequelize.models.Dollar.findOne();

    product.costUsd = product.costArs / dollar.rate;
    product.priceUsd = product.costUsd * 2 
    product.priceArs = product.costUsd * 2 * dollar.rate;
    product.priceWholesale = product.costUsd * 1.5 * dollar.rate;
  });

  return Product;
};

