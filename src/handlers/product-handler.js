const {
  getAllProductsController,
  getProductByIdController,
  createProductController,
  updateProductByIdController,
  deleteProductByIdController,
} = require("../controllers/product-controller");

const getAllProducts = async (req, res) => {
  try {
    const queries = req.query;
    const response = await getAllProductsController(queries);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getProductByIdController(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const response = await createProductController(productData);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    const response = await updateProductByIdController(productData, id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteProductByIdController(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};