const { Router } = require("express");
const {
  createImage,
  updateImage,
  deleteImage,
  uploadImages,
} = require("../handlers/image-handler");

const upload = require("../middlewares/uploadMiddleware");

const imageRouter = Router();

imageRouter.post("/", createImage);
imageRouter.patch("/:id", updateImage);
imageRouter.delete("/:id", deleteImage);
imageRouter.post("/upload", upload.array("images", 10), uploadImages);

module.exports = imageRouter;
