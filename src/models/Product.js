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
    const { costArs, costUsd, priceArs, priceUsd, priceWholesale } = product;

    const safeNumber = (value) => {
      const parsedValue = parseFloat(value);
      return isNaN(parsedValue) || parsedValue === 0 ? 0 : parsedValue;
    };

    const finalCostArs = safeNumber(costArs);
    const finalCostUsd = safeNumber(costUsd) || (finalCostArs ? finalCostArs / dollar.rate : 0);
    const finalPriceArs = safeNumber(priceArs) || (finalCostUsd ? finalCostUsd * 2 * dollar.rate : 0);
    const finalPriceUsd = safeNumber(priceUsd) || (finalCostUsd ? finalCostUsd * 2 : 0);
    const finalPriceWholesale = safeNumber(priceWholesale) || (finalCostUsd ? finalCostUsd * 1.5 * dollar.rate : 0);

    product.costArs = Number(finalCostArs);
    product.costUsd = Number(finalCostUsd);
    product.priceArs = Number(finalPriceArs);
    product.priceUsd = Number(finalPriceUsd);
    product.priceWholesale = Number(finalPriceWholesale);
  });

  return Product;
};
