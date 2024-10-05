const { Router } = require('express');

const router = Router();

router.use('/roles', require('./role'));

module.exports = router;
