const { Router } = require("express");
const {
  getSheetData,
  getProductSheetById,
  createProductSheet,
  updateProductSheetById,
  deleteProductSheetById,
} = require("../handlers/api-handler");

const googleApiRouter = Router();

googleApiRouter.get("/", getSheetData);
googleApiRouter.get("/:id", getProductSheetById);
googleApiRouter.post("/", createProductSheet);
googleApiRouter.put("/:id", updateProductSheetById);
googleApiRouter.delete("/:id", deleteProductSheetById);

module.exports = googleApiRouter;
