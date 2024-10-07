const { Op } = require("sequelize");
const { Category } = require("../db");

const getAllCategoriesController = async (name) => {
  try {
    let where = {};
    if (name) {
      where = { name: { [Op.iLike]: `%${name}%` } };
    }
    const allCategories = await Category.findAll({ where });
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

const createCategoryController = async (name) => {
  try {
    const [category, created] = await Category.findOrCreate({
      where: { name },
    });
    if (!created) {
      throw new Error("Category already exists");
    }
    return category;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Category creation failed");
  }
};

const updateCategoryController = async (name, id) => {
  try {
    const updatedCategory = await Category.findByPk(id);
    const [updated] = await Category.update(
      {
        name,
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
