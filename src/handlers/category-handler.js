const {
  getAllCategoriesController,
  createCategoryController,
  getCategoriesByIdController,
  updateCategoryController,
  deleteCategoryController,
} = require("../controller/category-controller");

const getAllCategories = async (req, res) => {
  try {
    const { name } = req.query;
    const response = await getAllCategoriesController(name);
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
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const newCategory = await createCategoryController(name);
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

    if (!name || !id) {
      return res.status(400).json({ error: "Name and ID is required" });
    }
    const response = await updateCategoryController(name, id);
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
