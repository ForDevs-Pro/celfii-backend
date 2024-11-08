const {
  getAllCategoriesController,
  createCategoryController,
  getCategoriesByIdController,
  updateCategoryController,
  deleteCategoryController,
} = require("../controllers/category-controller");

const { Category } = require("../db");

const getAllCategories = async (req, res) => {
  try {
    const { name } = req.query;
    const response = await getAllCategoriesController(name);
    const totalCount = await Category.count({
      where: name ? { name: { [Op.iLike]: `%${name}%` } } : {},
    });
    res.set("X-Total-Count", totalCount);
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getCategoriesByIdController(id);
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const file = req.file;
    const { name } = req.body;
    
    if (!name) return res.status(400).json({ error: "Name is required" });
    const newCategory = await createCategoryController({ name, image: file });
    res.status(200).json(newCategory);
  } catch (error) {
    console.error(`Error creating a category:`, error);
    return res.status(500).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const file = req.file ? req.file.buffer : null;
    if (!name || !id) return res.status(400).json({ error: "Name and ID is required" });
    const response = await updateCategoryController({ id, name, image: file });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteCategoryController(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
