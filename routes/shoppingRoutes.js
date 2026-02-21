const express = require('express');
const router = express.Router();
const shoppingController = require('../controllers/shoppingController');

router.get('/', shoppingController.getLists);
router.post('/', shoppingController.createList);
router.put('/:id', shoppingController.updateList);

module.exports = router;
