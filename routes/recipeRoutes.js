const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Standard CRUD routes mapping to the controller
router.get('/', recipeController.getRecipes);
router.post('/', recipeController.createRecipe);
router.put('/:id', recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;
