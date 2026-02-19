const express = require('express');
const cors = require('cors');
require('dotenv').config();

const recipeRoutes = require('./routes/recipeRoutes');
const residentRoutes = require('./routes/residentRoutes');
const carePlanRoutes = require('./routes/carePlanRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');



const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);


app.use('/api/recipes', recipeRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/careplan', carePlanRoutes);
app.use('/api/residents', authMiddleware, require('./routes/residentRoutes'));
app.use('/api/recipes', authMiddleware, require('./routes/recipeRoutes'));
app.use('/api/careplan', authMiddleware, require('./routes/carePlanRoutes'));
app.use('/api/inventory', authMiddleware, require('./routes/inventoryRoutes'));
app.get('/', (req, res) => {
  res.json({ message: "MT MediMorph Backend Running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use('/api/inventory', require('./routes/inventoryAdvanced'));
app.use('/api/shopping', require('./routes/shopping'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/cost', require('./routes/cost'));
app.use('/api/mealplanner', require('./routes/mealPlanner'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/ai', require('./routes/mealOptimizer'));
app.use('/api/ai', require('./routes/advancedMealOptimizer'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/shopping', require('./routes/shoppingList'));
app.use('/api/feedback', require('./routes/feedback'));
