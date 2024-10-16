const { createView } = require("../controllers/view-controller");
const { createCategoryController } = require("../controllers/category-controller");
const { Product, View, Image, Category } = require("../db");
const { Op } = require("sequelize");

const orderOptions = {
  "most popular": [["view", "DESC"]],
  "highest price": [["price", "DESC"]],
  "lowest price": [["price", "ASC"]],
};

const getProductIncludes = () => [
  { model: View, as: "view" },
  { model: Image, as: "images" },
  { model: Category, as: "category" },
];

const getProductData = ({ name, sort, page = 1, pageSize = 10, onlyDeleted = false }) => {
  const paranoid = !onlyDeleted;
  const order = orderOptions[sort] || [];
  const include = getProductIncludes();
  const limit = Math.max(parseInt(pageSize, 10), 1);
  const offset = Math.max((parseInt(page, 10) - 1) * limit, 0);
  const where = {
    ...(onlyDeleted ? { deletedAt: { [Op.ne]: null } } : {}),
    ...(name && { [Op.or]: [{ name: { [Op.iLike]: `%${name}%` } }] }),
  };

  return { limit, offset, order, where, include, paranoid };
};

const addProductAssociations = async ({ id, category }) => {
  try {
    await createView(id);
    const product = await Product.findByPk(id);

    if (category) {
      const categoryInstances = await createCategoryController(category);
      await product.setCategory(categoryInstances);
    }
  } catch (error) {
    console.error("Error adding associations:", error.message);
    throw new Error(`Error adding associations: ${error.message}`);
  }
};

const setProductAssociations = async (productData) => {
  try {
    const product = await Product.findByPk(productData.id);

    if (productData.images) {
      const imageInstances = await createImages(productData.images);
      await product.setImages(imageInstances);
    }
    if (productData.category) {
      const categoryInstances = await createCategory(productData.category);
      await product.setCategory(categoryInstances);
    }
  } catch (error) {
    console.error("Error setting associations:", error.message);
    throw new Error(`Error setting associations: ${error.message}`);
  }
};

module.exports = {
  getProductData,
  getProductIncludes,
  addProductAssociations,
  setProductAssociations,
};
