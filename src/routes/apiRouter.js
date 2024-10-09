const { Router } = require('express');
const {
  getSheetData,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} = require('../handlers/api-handler');

const googleApiRouter = Router();

googleApiRouter.get('/', getSheetData);
googleApiRouter.get('/:id', getProductById);
googleApiRouter.post('/', createProduct);
googleApiRouter.put('/:id', updateProductById);
googleApiRouter.delete('/:id', deleteProductById);

// Exportar el router
module.exports = googleApiRouter;
