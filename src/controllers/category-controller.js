const { Op } = require("sequelize");
const { sequelize, Category } = require("../db");
const { uploadImageToCloudinary } = require("../utils/image-util");

const defaultImageUrl =
  "https://lh5.googleusercontent.com/proxy/r3NcrOciq9UC0Zk-ARYD8AaIBJvvTv_gnH-Nz6gn3w7KrVP8GzUNvPciRFwm9EBFe6qPWTkzZWebSBtGM3t0WxaPVZIiD7e593MYklTVj6zvj2U0CDMzMrp05fC40JttzTIuHFCu32hhtG7xRnSaEctjkQKldC-hOqswFn_VHo6hoTJ9bLO8SbexXOaESYbt99VCZbfZzoy2";

const getAllCategoriesController = async (name) => {
  try {
    let where = {};
    if (name) {
      where = { name: { [Op.iLike]: `%${name}%` } };
    }
    const allCategories = await Category.findAll({
      where,
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM "Products" AS "product"
              WHERE
                "product"."categoryId" = "Category"."id"
            )`),
            "productCount",
          ],
        ],
      },
    });
    return allCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error(`Error fetching categories: ${error.message}`);
  }
};

const getCategoriesByIdController = async (id) => {
  try {
    const category = await Category.findByPk(id);
    if (!category) throw new Error(`Category with id ${id} not found`);
    return category;
  } catch (error) {
    console.error("Error fetching category by id:", error);
    throw new Error(`Error fetching category with id ${id}`);
  }
};

const createCategoryController = async ({ name, image }) => {
  try {
    const uploadedImage = image ? await uploadImageToCloudinary(image) : defaultImageUrl;
    const [category] = await Category.findOrCreate({
      where: { name },
      defaults: {
        image: uploadedImage.secure_url ? uploadedImage.secure_url : uploadedImage,
      },
    });
    return category;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Category creation failed");
  }
};

const updateCategoryController = async ({ id, name, image }) => {
  try {
    const uploadedImage = image ? await uploadImageToCloudinary(image) : defaultImageUrl;
    const updatedCategory = await Category.findByPk(id);
    const [updated] = await Category.update(
      {
        name,
        image: uploadedImage.secure_url || uploadedImage.url,
      },
      {
        where: { id },
        returning: true,
      }
    );
    if (!updated) throw new Error("Category not found");
    return updatedCategory;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Category update failed");
  }
};

const deleteCategoryController = async (id) => {
  try {
    const deleted = await Category.destroy({ where: { id } });
    if (!deleted) throw new Error("Category not found");
    return "Category deleted successfully";
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Error deleting category");
  }
};

module.exports = {
  getAllCategoriesController,
  getCategoriesByIdController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
};
