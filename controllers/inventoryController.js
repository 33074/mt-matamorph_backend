const pool = require('../config/db');

exports.getInventory = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM inventory ORDER BY name ASC');
    res.json(rows);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      current_stock, is_allergen, allergen_type, price, 
      supplier, storage_location 
    } = req.body;
    
    await pool.execute(
      `UPDATE inventory 
       SET current_stock = ?, is_allergen = ?, allergen_type = ?, price = ?, 
           supplier = ?, storage_location = ? 
       WHERE id = ?`, 
      [current_stock, is_allergen ? 1 : 0, allergen_type || null, price || 0, supplier || null, storage_location || null, id]
    );
    res.json({ success: true });
  } catch (err) { 
    console.error("Update Error:", err.message);
    res.status(500).json({ error: err.message }); 
  }
};

exports.createIngredient = async (req, res) => {
  try {
    const { 
      name, category, unit, current_stock, minimum_stock, 
      price, is_allergen, allergen_type, supplier, storage_location 
    } = req.body;

    await pool.execute(
      `INSERT INTO inventory 
      (name, category, unit, current_stock, minimum_stock, price, is_allergen, allergen_type, supplier, storage_location) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, category, unit, current_stock || 0, minimum_stock || 5, 
        price || 0, is_allergen ? 1 : 0, allergen_type || null, 
        supplier || null, storage_location || null
      ]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Create Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
