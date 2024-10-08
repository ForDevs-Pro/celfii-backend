const { Router } = require('express')
const categoryRouter = require('./categoryRouter')
const imageRouter = require('./imagesRouter')
const productRouter = require("./productRouter");
const roleRouter = require("./roleRouter")

const router = Router()

router.use('/categories', categoryRouter)
router.use('/images', imageRouter)
router.use("/products", productRouter);
router.use('/roles', roleRouter);

module.exports = router;
