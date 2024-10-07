const { Router } = require('express')
const categoryRouter = require('./categoryRouter')
const imageRouter = require('./imagesRouter')

const router = Router()
router.use('/categories', categoryRouter)
router.use('/images', imageRouter)

module.exports = router