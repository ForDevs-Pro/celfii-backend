const express = require('express');
const { createRole, deleteRole } = require('../handlers/roleHandler');
const router = express.Router();

router.post('/', createRole);
router.delete('/:id', deleteRole);

module.exports = router;
