const { Router } = require("express");
const productRouter = require("./productRouter");

const router = Router();
router.use("/products", productRouter);

module.exports = router;
