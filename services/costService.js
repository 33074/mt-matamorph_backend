const pool = require('../config/db');

exports.calculateTotalInventoryCost = async () => {
  const [[{ totalCost }]] = await pool.execute(
    'SELECT SUM(quantity * price) as totalCost FROM inventory'
  );
  return totalCost || 0;
};
