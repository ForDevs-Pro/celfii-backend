const { Router } = require("express");
const productRouter = require("./productRouter");
const roleRouter = require("./roleRouter")
const userRouter = require("./userRouter")

const router = Router();
router.use("/products", productRouter);
router.use('/roles', roleRouter);
router.use('/users', userRouter);


module.exports = router;
