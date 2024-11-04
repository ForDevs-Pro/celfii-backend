const { Router } = require("express");
const { getSheetData } = require("../handlers/api-handler");

const googleApiRouter = Router();

googleApiRouter.get("/", getSheetData);

module.exports = googleApiRouter;
