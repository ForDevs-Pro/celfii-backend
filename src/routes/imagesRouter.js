const { Router } = require('express')
const {
    createImage,
    updateImage,
    deleteImage,
} = require('../handler/images-handler')

const imageRouter = Router()

imageRouter.post("/", createImage)
imageRouter.patch("/:id", updateImage)
imageRouter.delete("/:id", deleteImage)

module.exports = imageRouter;