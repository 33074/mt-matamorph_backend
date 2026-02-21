const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/', inventoryController.getInventory);
router.post('/', inventoryController.createIngredient); // Enable adding new items
router.put('/:id', inventoryController.updateStock);

module.exports = router;
