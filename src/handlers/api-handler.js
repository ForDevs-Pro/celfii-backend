const {
  getSheetDataService,
  getDataSheetByIdService,
  createDataSheetService,
  updateDataSheetByIdService,
  deleteDataSheetByIdService,
} = require('../services/api-service');

const getSheetData = async (req, res) => {
  try {
    const response = await getSheetDataService();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductSheetById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await getDataSheetByIdService(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProductSheet = async (req, res) => {
  try {
    const productData = req.body;
    const response = await createDataSheetService(productData);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductSheetById = async (req, res) => {
  const { id } = req.params;
  try {
    const productData = req.body;
    const response = await updateDataSheetByIdService(productData, id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProductSheetById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await deleteDataSheetByIdService(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSheetData,
  getProductSheetById,
  createProductSheet,
  updateProductSheetById,
  deleteProductSheetById,
};
