const { Router } = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  restoreProductById,
} = require("../handlers/product-handler");

const upload = require("../middlewares/uploadMiddleware");

const productRouter = Router();
productRouter.post("/", upload.array("images", 10), createProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", upload.array("images", 10), updateProductById);
productRouter.delete("/:id", deleteProductById);
productRouter.post("/:id", restoreProductById);

module.exports = productRouter;
