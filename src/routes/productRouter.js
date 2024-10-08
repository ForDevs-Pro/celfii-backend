const { Router } = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} = require("../handlers/product-handler");

const productRouter = Router();
productRouter.post("/", createProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", updateProductById);
productRouter.delete("/:id", deleteProductById);

module.exports = productRouter;
