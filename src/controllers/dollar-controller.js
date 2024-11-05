const { Dollar, Product } = require("../db");

const createDollarEntryController = async (rate) => {
  try {
    await Dollar.create({ rate });
    return;
  } catch (error) {
    console.error("Error creating dollar:", error.message);
    throw new Error("Error creating dollar");
  }
};

const updateDollarController = async ({ rate, date = new Date() }) => {
  try {
    const dollar = await Dollar.findOne();
    if (dollar) {
      dollar.rate = rate;
      dollar.date = date;
      await dollar.save();

      const products = await Product.findAll();
      for (const product of products) {
        product.costArs = product.costUsd * rate;
        product.priceArs = product.costUsd * 2 * rate;
        product.priceWholesale = product.costUsd * 1.5 * rate;

        await product.save();
      }

      console.log("Todos los productos han sido actualizados con la nueva tasa del dólar.");
      return dollar;
    }
  } catch (error) {
    console.error("Error updating dollar:", error.message);
    throw new Error("Error updating dollar");
  }
};

const getDollarController = async () => {
  try {
    const dollar = await Dollar.findOne();
    return dollar;
  } catch (error) {
    console.error("Error fetching dollar:", error.message);
    throw new Error("Error fetching dollar");
  }
};

module.exports = {
  createDollarEntryController,
  updateDollarController,
  getDollarController,
};
