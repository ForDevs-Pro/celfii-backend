const { Router } = require("express");
const {
  uploadImages,
  deleteImages,
} = require("../handlers/image-handler");

const upload = require("../middlewares/uploadMiddleware");

const imageRouter = Router();

imageRouter.post("/upload/:id", upload.array("images", 10), uploadImages);
imageRouter.delete("/", deleteImages);

module.exports = imageRouter;
