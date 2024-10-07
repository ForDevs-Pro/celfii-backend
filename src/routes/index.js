const { Router } = require("express");
const productRouter = require("./productRouter");
const roleRouter = require("./roleRouter")

const router = Router();
router.use("/products", productRouter);
router.use('/roles', roleRouter);

module.exports = router;
