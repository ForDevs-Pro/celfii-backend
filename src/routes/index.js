const { Router } = require("express");
const categoryRouter = require("./categoryRouter");
const productRouter = require("./productRouter");
const roleRouter = require("./roleRouter");
const userRouter = require("./userRouter");
const googleApiRouter = require("./apiRouter");
const authRouter = require("./authRouter");

const router = Router();

router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/roles", roleRouter);
router.use("/users", userRouter);
router.use("/api", googleApiRouter);
router.use("/auth", authRouter);

module.exports = router;
