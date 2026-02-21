require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();


// --------------------
// Ensure uploads folder exists
// --------------------
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


// --------------------
// Core middleware
// --------------------
app.use(express.json()); // REQUIRED for req.body
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

app.use("/uploads", express.static(uploadDir));


// --------------------
// Import Routes
// --------------------
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const residentRoutes = require("./routes/residentRoutes");
const aiRoutes = require("./routes/ai");
const dashboardRoutes = require("./routes/dashboardRoutes");
const shoppingRoutes = require("./routes/shoppingRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const mealPlanRoutes = require("./routes/mealPlanRoutes");


// --------------------
// Route Mounting
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/residents", residentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/shopping-lists", shoppingRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/meal-plans", mealPlanRoutes);


// --------------------
// 404 handler (helps debugging)
// --------------------
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
});


// --------------------
// Global error handler
// --------------------
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message
  });
});


// --------------------
// Start server
// --------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});