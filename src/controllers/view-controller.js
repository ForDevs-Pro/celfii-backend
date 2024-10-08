const { View } = require("../db");

const createView = async (productId) => {
  try {
    const view = await View.create({ productId });
    return view;
  } catch (error) {
    console.error("Error creating a view", error);
    throw new Error(`Error creating a view: ${error.message}`);
  }
};

const addView = async (productId) => {
  try {
    const view = await View.findOne({ where: { productId } });
    if (view) {
      view.counter += 1;
      await view.save();
    }
    return;
  } catch (error) {
    console.error("Error updating a view", error);
    throw new Error(`Error updating a view: ${error.message}`);
  }
};

module.exports = {
  createView,
  addView,
};
