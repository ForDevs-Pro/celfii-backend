const {
  getSheetDataController,
  getDataSheetByIdController,
  createDataSheetController,
  updateDataSheetByIdController,
  deleteDataSheetByIdController,
} = require('../services/api-service');

const getSheetData = async (req, res) => {
  try {
    const response = await getSheetDataController();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await getDataSheetByIdController(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const response = await createDataSheetController(productData);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const productData = req.body;
    const response = await updateDataSheetByIdController(productData, id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await deleteDataSheetByIdController(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSheetData,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
