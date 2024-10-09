const {
  getSheetDataController,
  getDataSheetByIdController,
  createDataSheetController,
  updateDataSheetByIdController,
  deleteDataSheetByIdController,
} = require('../controllers/api-controller');

// Handler para obtener todos los productos desde Google Sheets
const getSheetData = async (req, res) => {
  try {
    const response = await getSheetDataController();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handler para obtener un producto por ID desde Google Sheets
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await getDataSheetByIdController(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handler para crear un producto en Google Sheets
const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const response = await createDataSheetController(productData);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handler para actualizar un producto por ID en Google Sheets
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

// Handler para eliminar (borrar lógicamente) un producto por ID en Google Sheets
const deleteProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await deleteDataSheetByIdController(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Exportar todos los handlers
module.exports = {
  getSheetData,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
