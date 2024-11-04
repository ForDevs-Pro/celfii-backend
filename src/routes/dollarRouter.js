const { Router } = require("express");
const {
    updateDollar
} = require("../handlers/dollar-handler");


const dollarRouter = Router();

dollarRouter.put("/", updateDollar);

module.exports = dollarRouter;
