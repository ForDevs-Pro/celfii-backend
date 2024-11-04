const { Router } = require("express");
const { updateDollar, getDollar, getDollarById } = require("../handlers/dollar-handler");

const dollarRouter = Router();

dollarRouter.patch("/", updateDollar);
dollarRouter.get("/", getDollar);
dollarRouter.get("/:id", getDollarById);

module.exports = dollarRouter;
